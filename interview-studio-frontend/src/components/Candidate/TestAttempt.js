import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";

const TestAttempt = ({ match }) => {
  const { assignmentId } = match.params;
  
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [identityVerified, setIdentityVerified] = useState(false);
  const [showWebcamDialog, setShowWebcamDialog] = useState(true);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);

  const webcamRef = React.useRef(null);

  // Fetch test details when component loads
  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`/api/candidates/test/${assignmentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [assignmentId]);

  // Capture and verify identity via webcam
  const handleVerifyIdentity = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `/api/proctoring/identity`,
        { livePhoto: imageSrc, assignmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.verified) {
        setIdentityVerified(true);
        setShowWebcamDialog(false);
      } else {
        alert("Identity verification failed! Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error during verification. Try again.");
    }
  };

  // Send periodic webcam snapshots to the server
  useEffect(() => {
    let snapshotInterval;

    if (identityVerified) {
      snapshotInterval = setInterval(async () => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          try {
            const token = localStorage.getItem("token");
            await axios.post(
              `/api/proctoring/${assignmentId}`,
              { imageData: imageSrc },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (err) {
            console.error("Error sending snapshot", err);
          }
        }
      }, 30000); // 30 seconds interval
    }

    return () => clearInterval(snapshotInterval); // Cleanup on unmount
  }, [identityVerified, assignmentId]);

  // Handle app/tab switch detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Notify the server of a tab switch
        try {
          const token = localStorage.getItem("token");
          axios.post(
            `/api/proctoring/${assignmentId}`,
            { eventType: "appSwitch" },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error("Error logging app switch", error);
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange); // Cleanup listener
  }, [assignmentId]);

  // Check server for warnings or termination
  useEffect(() => {
    let statusInterval;

    if (identityVerified) {
      statusInterval = setInterval(async () => {
        try {
          const token = localStorage.getItem("token");
          const { data } = await axios.get(
            `/api/proctoring/${assignmentId}/status`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (data.terminated) {
            alert("Test terminated due to policy violations. Contact support.");
            window.location.href = "/"; // Redirect on termination
          } else if (data.warnings) {
            alert(`Warning: ${data.message}`);
          }
        } catch (error) {
          console.error("Error checking proctoring status", error);
        }
      }, 10000); // Check every 10 seconds
    }

    return () => clearInterval(statusInterval); // Cleanup interval
  }, [identityVerified, assignmentId]);

  // Progress to the next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setResponse(""); // Clear the response input for the next question
    } else {
      alert("Test completed! Submitting responses...");
      // Call API endpoint to submit test responses here
    }
  };

  if (loading) return <CircularProgress />;
  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <Container>
      <Typography variant="h4">{test.title}</Typography>
      <Typography variant="h6" style={{ marginBottom: "20px" }}>
        {test.instructions}
      </Typography>

      {/* Identity Verification Dialog */}
      {!identityVerified && (
        <Dialog open={showWebcamDialog}>
          <DialogTitle>Identity Verification</DialogTitle>
          <DialogContent>
            <Typography>
              Please capture your photo for identity verification.
            </Typography>
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              style={{ width: "100%" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleVerifyIdentity} variant="contained">
              Capture & Verify
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Question Section */}
      {identityVerified && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px" }}>
          <div>
            <Typography variant="h6">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </Typography>
            <Typography style={{ marginBottom: "20px" }}>
              {currentQuestion.text}
            </Typography>
            <input
              type="text"
              placeholder="Type your answer here"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                fontSize: "16px",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
            >
              Next Question
            </Button>
          </div>

          {/* Webcam Preview */}
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: "200px",
              height: "150px",
              borderRadius: "10px",
              border: "2px solid #000",
            }}
          />
        </div>
      )}
    </Container>
  );
};

export default TestAttempt;
