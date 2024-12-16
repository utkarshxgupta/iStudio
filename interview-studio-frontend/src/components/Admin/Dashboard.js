import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
} from "@material-ui/core";
import axios from "axios";

const AdminDashboard = () => {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("/api/admin/overview", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOverview(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography>Total Tests: {overview.totalTests}</Typography>
      <Typography>Total Candidates: {overview.totalCandidates}</Typography>
      <Typography>Total Anomalies: {overview.totalAnomalies}</Typography>

      <Typography variant="h6" style={{ marginTop: "20px" }}>
        Recent Anomalies
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Candidate</TableCell>
            <TableCell>Anomaly Type</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {overview.recentAnomalies.map((anomaly) => (
            <TableRow key={anomaly.id}>
              <TableCell>{anomaly.candidateName}</TableCell>
              <TableCell>{anomaly.type}</TableCell>
              <TableCell>
                {new Date(anomaly.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
