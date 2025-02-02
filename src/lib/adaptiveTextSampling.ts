interface TranscriptLimiterConfig {
  maxLength: number;
  initialContentRatio: number;  // 0.4 means 40% of maxLength for content not sampled
  minChunksPerSegment: number;        // Minimum number of segments to sample at each point
  chunkSize: number;            // Character count per segment. Segments are used for sampling
}

const DEFAULT_CONFIG: TranscriptLimiterConfig = {
  maxLength: 22500, // at 22500 exceeds chatgpts free tier character limit. Determined by trial & error
  initialContentRatio: 0.4,
  chunkSize: 300, // approximately 15 seconds of words
  minChunksPerSegment: 3,
};

/**
 * Strategically reduces long text to fit within a maximum chatgpt freetier limit while attempting to preserve context.
 * Uses a two-phase sampling strategy:
 * 1. Keeps initial portion of the text (default 40% of max length) to preserve opening context
 * 2. Samples evenly distributed segments from the remaining content
 *
 * It first chunks content into text of approximately 300 characters long (by default),
 * always ending at a word boundary. For example, in a transcript, this roughly
 * corresponds to 15 seconds of speech. The text is divided into these segments
 * before sampling to ensure we don't cut mid-sentence and maintain readable chunks.
 *
 * @param textToReduce - The input text to be reduced
 * @param config - Optional configuration object
 * @param config.maxLength - Maximum length of output text (default: 23000)
 * @param config.initialContentRatio - Portion of maxLength to reserve for initial content (default: 0.4)
 * @param config.chunkSize - Size of each text segment for sampling (default: 300)
 * @param config.minChunksPerSegment - Minimum chunks to sample at each point (default: 3)
 *
 * @returns Reduced text that fits within maxLength, with preserved word boundaries
 *
 * @example
 * const config = { maxLength: 1000, initialContentRatio: 0.5 };
 * const summary = fitTextToContextLimit(longText, config);
 *
 * @remarks
 * - Maintains word boundaries, never cuts words in half
 * - Ensures even distribution of sampled content after initial portion
 * - Useful for preparing long texts for AI processing with character limits
 * - Segments are sampled in groups (minChunksPerSegment) to maintain local context
 * - Cleanup includes normalizing whitespace and removing excessive newlines
 */
export function fitTextToContextLimit(
  textToReduce: string,
  config: Partial<TranscriptLimiterConfig> = {}
): string {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  if (textToReduce.length <= finalConfig.maxLength) {
    return textToReduce;
  }

  const textChunks = chunkText(textToReduce, finalConfig.chunkSize);

  const result: string[] = [];
  let currentLength = 0;

  // 1. Get initial segments until we hit the initial content ratio
  const initialContentLength = Math.floor(finalConfig.maxLength * finalConfig.initialContentRatio);
  let i = 0;

  while (i < textChunks.length && currentLength < initialContentLength) {
    const segment = textChunks[i];
    if (currentLength + segment.length <= initialContentLength) {
      result.push(segment);
      currentLength += segment.length;
    } else {
      const remainingSpace = initialContentLength - currentLength;
      if (remainingSpace > 10) {
        const partialSegment = segment.slice(0, remainingSpace);
        result.push(partialSegment);
        currentLength += remainingSpace;
      }
      break;
    }
    i++;
  }

  // 2. Sample remaining content with even distribution
  const remainingSpace = finalConfig.maxLength - currentLength;
  const remainingSegments = textChunks.slice(i);

  if (remainingSegments.length > 0) {
    // Calculate how many complete samples we can fit
    const avgSegmentLength = getCombinedLength(remainingSegments) / remainingSegments.length;
    const estimatedSamplesCapacity = Math.floor(remainingSpace / (avgSegmentLength * finalConfig.minChunksPerSegment));

    // Get evenly distributed sample points
    const samplePoints = getSamplePoints(remainingSegments.length, estimatedSamplesCapacity);

    // Sample from remaining content
    for (const point of samplePoints) {
      if (currentLength >= finalConfig.maxLength) break;

      const index = Math.floor(remainingSegments.length * point);
      const sampleSize = Math.min(finalConfig.minChunksPerSegment, remainingSegments.length - index);

      for (let j = 0; j < sampleSize; j++) {
        const segment = remainingSegments[index + j];
        const spaceLeft = finalConfig.maxLength - currentLength;

        if (segment.length <= spaceLeft) {
          result.push(segment);
          currentLength += segment.length;
        } else if (spaceLeft > 10) {
          const partialSegment = segment.slice(0, spaceLeft);
          result.push(partialSegment);
          currentLength += spaceLeft;
          break;
        }
      }
    }
  }

  return result.join('').replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/**
 * Splits text into chunks of approximately the target length, preserving word boundaries.
 * Each chunk will be as close to the target length as possible without exceeding it,
 * and will always end at a complete word.
 */
function chunkText(fullText: string, chunkCharLimit: number): string[] {
  const result: string[] = [];
  let currentPosition = 0;

  while (currentPosition < fullText.length) {
    // If remaining text is shorter than target, take it all
    if (currentPosition + chunkCharLimit >= fullText.length) {
      result.push(fullText.slice(currentPosition).trim());
      break;
    }

    // Look at a slice that's targetLength long
    let slice = fullText.slice(currentPosition, currentPosition + chunkCharLimit);

    // Find the last space in this slice
    const lastSpaceIndex = slice.lastIndexOf(' ');

    // Take up to the last space in our slice
    slice = slice.slice(0, lastSpaceIndex);
    currentPosition += lastSpaceIndex + 1;

    result.push(slice.trim());
  }

  return result;
}

function getCombinedLength(segments: string[]): number {
  return segments.reduce((total, segment) => total + segment.length, 0);
}

function getSamplePoints(remainingLength: number, sampleSize: number): number[] {
  if (remainingLength <= 0 || sampleSize <= 0) return [];
  const points: number[] = [];
  const interval = 1 / (sampleSize + 1);

  for (let i = 1; i <= sampleSize; i++) {
    points.push(interval * i);
  }

  return points;
}
