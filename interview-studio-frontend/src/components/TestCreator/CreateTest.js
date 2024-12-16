import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from "@material-ui/core";
import axios from "axios";

const CreateTest = () => {
  const [testTitle, setTestTitle] = useState("");
  const [description, setDescription] = useState("");
  const [proctoringSettings, setProctoringSettings] = useState({
    identityVerification: true,
    multipleFacesDetection: true,
    faceDetection: true,
    appSwitchDetection: true,
    warningsLimit: 3,
    autoLogout: true,
  });

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        title: testTitle,
        description,
        proctoringSettings,
      };
      const response = await axios.post("/api/tests", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert(`Test Created: ${response.data.title}`);
      setTestTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Typography variant="h4">Create a New Test</Typography>
      <TextField
        label="Test Title"
        value={testTitle}
        onChange={(e) => setTestTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
        multiline
        rows={4}
      />
      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Proctoring Settings
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={proctoringSettings.identityVerification}
            onChange={(e) =>
              setProctoringSettings((prev) => ({
                ...prev,
                identityVerification: e.target.checked,
              }))
            }
          />
        }
        label="Identity Verification"
      />
      <FormControlLabel
        control={
          <Switch
            checked={proctoringSettings.multipleFacesDetection}
            onChange={(e) =>
              setProctoringSettings((prev) => ({
                ...prev,
                multipleFacesDetection: e.target.checked,
              }))
            }
          />
        }
        label="Multiple Faces Detection"
      />
      <FormControlLabel
        control={
          <Switch
            checked={proctoringSettings.appSwitchDetection}
            onChange={(e) =>
              setProctoringSettings((prev) => ({
                ...prev,
                appSwitchDetection: e.target.checked,
              }))
            }
          />
        }
        label="App Switch Detection"
      />
      <TextField
        label="Warnings Limit"
        type="number"
        value={proctoringSettings.warningsLimit}
        onChange={(e) =>
          setProctoringSettings((prev) => ({
            ...prev,
            warningsLimit: +e.target.value,
          }))
        }
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        style={{ marginTop: "20px" }}
      >
        Submit
      </Button>
    </Container>
  );
};

export default CreateTest;
