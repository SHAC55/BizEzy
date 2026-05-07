import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DashboardStatCard from "../components/DashboardStatCard";
import DashboardQuickActions from "../components/DashboardQuickActions";
import { useSales } from "../hooks/useSales";
import DashboardRecentSales from "../components/DashboardRecentSales";
import PageLoader from "../components/loaders/PageLoader";

const Dashboard = () => {
  const { sales, isLoading, error } = useSales({
    page: 1,
    limit: 5,
  });
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      setLastUpdated(new Date().toISOString());
    }
  }, [isLoading, sales]);

  if (isLoading && !sales?.length) return <PageLoader />;

  return (
    <div className="bg-white text-black  mb-3 mr-3 w-full rounded-3xl p-2 md:ml-20 md:mt-2 mt-14 min-h-screen">
      <Header title="Dashboard" para="overview  of sales  and  analytics" />
      <DashboardStatCard />
      <DashboardQuickActions />
      <DashboardRecentSales sales={sales} isLoading={isLoading} error={error} />
    </div>
  );
};

export default Dashboard;
