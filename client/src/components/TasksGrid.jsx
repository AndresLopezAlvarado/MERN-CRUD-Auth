import { useState } from "react";
import Spinner from "../components/Spinner.jsx";
import { useTasks } from "../context/TasksContext";
import { TaskCard } from "../components/TaskCard";

function TasksGrid() {
  const [loading, setLoading] = useState(false);
  const { getTasks, tasks } = useTasks();

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-2"
        >
          {tasks.map((task) => (
            <TaskCard task={task} key={task._id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TasksGrid;
