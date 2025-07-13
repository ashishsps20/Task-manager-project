import React from 'react'
import Layout from "../../components/Layout/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");

  const navigate = useNavigate();

  const getAllTasks = async () => {
     try {
      const response = await axiosInstance.get(API_PATHS.TASKS.GET_ALL_TASKS, {
        params: {
          status: filterStatus === "All" ? "" : filterStatus,
        },
      });

      setAllTasks( 
        response.data?.tasks?.length > 0 ? response.data.tasks : []
      );

      // Map statusSummary data with fixed labels and order
      const statusSummary = response.data?.statusSummary || [];
       
      statusArray =[
            {label: "All", count: statusSummary.all || 0},
            {label: "Pending", count: statusSummary.pendingTasks || 0},
            {label: "In Progress", count: statusSummaryinProgressTasks ||0},
            {label: "Completed", count: statusSummary.completedTasks || 0},
      ];

      setTabs(statusArray);
    }
    catch(error){
         console.error("Error fetching users:",error);
    }
  };

  const handleClick = (taskData) => {
    navigate('/admin/create-task', { state: { taskId: taskData._id } });
  }; 

  // download task report
  const handleDownloadReport = async () => {
    // Implementation to download task report will be here
  };

  useEffect(() => {
    getAllTasks(filterStatus);
    return () => {};
  }, [filterStatus]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
    <div className="my-5">
       <div className="flex flex-col md: flex-row md:items-center justify-between">
       <div className="flex items-center justify-between gap-3">
       <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>
<button
className="flex md:hidden download-btn"
onClick={handleDownloadReport}>
<LuFileSpreadsheet className="text-lg"/>
Download Report
</button>
</div>
</div>
</div>
</DashboardLayout>
  );
};

export default ManageTasks;