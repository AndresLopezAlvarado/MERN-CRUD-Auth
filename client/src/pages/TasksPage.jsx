import { useEffect, useReducer, useState } from "react";
import { useTasks } from "../context/TasksContext";
import { TaskCard } from "../components/TaskCard";
import Spinner from "../components/Spinner.jsx";

export function TasksPage() {
  const { getTasks, tasks } = useTasks();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <>
      {tasks.length === 0 && <h1>No tasks</h1>}
      {loading ? (
        <Spinner />
      ) : (
        <div
          // onLoad={() => getTasks()}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-2"
        >
          {tasks.map((task) => (
            <TaskCard task={task} key={task._id} />
          ))}
        </div>
      )}
    </>
  );
}
