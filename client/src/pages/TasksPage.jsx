import { useEffect, useState } from "react";
import { useTasks } from "../context/TasksContext";
import Spinner from "../components/Spinner.jsx";
import TasksTable from "../components/TasksTable.jsx";
import TasksGrid from "../components/TasksGrid.jsx";
import dayjs from "dayjs";

export function TasksPage() {
  const { getTasks, tasks } = useTasks();
  const [loading, setLoading] = useState(false);
  const [showType, setShowType] = useState("table");
  const columns = [
    { header: "ID", accessorKey: "_id" },
    { header: "Title", accessorKey: "title" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Created at",
      accessorKey: "date",
      cell: (info) => dayjs(info.getValue()).utc().format("DD/MM/YYYY"),
    },
  ];

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      <div className="flex justify-center items-center gap-x-4">
        <button
          className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
          onClick={() => {
            setShowType("table");
          }}
        >
          Table
        </button>
        <button
          className="bg-sky-300 hover:bg-sky-600 px-4 py-1 rounded-lg"
          onClick={() => {
            setShowType("card");
          }}
        >
          Card
        </button>
      </div>
      {tasks.length === 0 && <h1>No tasks</h1>}
      {loading ? (
        <Spinner />
      ) : showType === "table" ? (
        <TasksTable data={tasks} columns={columns} />
      ) : (
        <TasksGrid />
      )}
    </>
  );
}
