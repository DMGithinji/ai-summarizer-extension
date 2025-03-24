import { Star, MessageSquare } from "lucide-react";
import { useState } from "react";

const MenuBar = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [wantResponse, setWantResponse] = useState(false);

  const handleReviewClick = () => {
    window.open(
      "https://chromewebstore.google.com/detail/justtldr-free-ai-summariz/cmnjpgpkkdmkkmpliipnmhbelgbiefpa/reviews",
      "_blank"
    );
  };

  const handleFeedbackClick = () => {
    setIsFeedbackOpen(true);
  };

  const handleFeedbackSubmit = () => {
    const feedbackData = {
      google_sheet: "justTLDR Feedback",
      message: feedback,
      type: "Extension Feedback",
      email: email || null,
    };

    setSubmitting(true);

    // server might take too long to respond coz of cold start, so we handle request in background
    chrome.runtime.sendMessage({
      type: "SUBMIT_FEEDBACK",
      payload: feedbackData,
    });

    // fake loading because responding immediately makes it feel like it's not working
    setTimeout(() => {
      setSubmitting(false);
      setFeedback("");
      setEmail("");
      setWantResponse(false);
      setIsFeedbackOpen(false);
    }, 1000);
  };

  const handleCloseModal = () => {
    setFeedback("");
    setEmail("");
    setWantResponse(false);
    setIsFeedbackOpen(false);
  };

  return (
    <>
      <div className="w-full bg-neutral-800 text-white py-3 px-4 flex items-center justify-between sticky top-0 shadow z-[100]">
        <div className="flex items-center">
          <span className="font-medium text-base">
            justTLDR: Free AI Summarizer
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleReviewClick}
            className="flex items-center px-3 py-1 bg-neutral-800 hover:bg-neutral-600 rounded text-sm transition-colors duration-200"
          >
            <Star size={16} className="mr-2 text-yellow-500" />
            <span>Leave a Review</span>
          </button>

          <button
            onClick={handleFeedbackClick}
            className="flex items-center px-3 py-1 bg-neutral-800 hover:bg-neutral-600 rounded text-sm transition-colors duration-200"
          >
            <MessageSquare size={16} className="mr-2 text-blue-400" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Custom Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] p-4">
          <div className="bg-neutral-900 text-white rounded-lg shadow-xl max-w-md w-full p-6">
            {/* Header */}
            <div className="space-y-2 pb-3 text-center">
              <h2 className="text-xl font-bold">We’d Love Your Feedback!</h2>
              <p className="text-neutral-400 text-base">
                Your thoughts help make justTLDR better. Let us know what’s on
                your mind! 🌟
              </p>
            </div>

            {/* Form Content */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="feedback" className="font-medium text-base">
                  What do you think about justTLDR?
                </label>
                <textarea
                  id="feedback"
                  placeholder="Share your thoughts, suggestions, or issues..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 h-32 resize-none text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="want-response"
                    checked={wantResponse}
                    onChange={(e) => setWantResponse(e.target.checked)}
                    className="h-4 w-4 text-green-500 border-neutral-700 rounded focus:ring-green-500 cursor-pointer"
                  />
                  <label
                    htmlFor="want-response"
                    className="text-sm font-medium"
                  >
                    I’d like a response from the team
                  </label>
                </div>

                {wantResponse && (
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Your Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-md p-2 text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-base"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-6">
              <button
                onClick={handleFeedbackSubmit}
                disabled={!feedback.trim() || submitting}
                className="text-base w-full sm:w-auto bg-green-500 text-white font-semibold py-2 px-4 rounded-md disabled:bg-green-700 disabled:text-gray-300 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
              <button
                onClick={handleCloseModal}
                className="text-base w-full sm:w-auto border border-neutral-700 text-neutral-400 hover:text-neutral-300 hover:border-neutral-300 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuBar;
