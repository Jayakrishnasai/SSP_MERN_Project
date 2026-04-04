import { useEffect, useState } from "react";

import {
    addTask,
    deleteTask,
    getTasks,
    updateTask,
} from "./services/taskServices";

function useCourses() {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function loadTasks() {
            try {
                const { data } = await getTasks();

                if (isMounted) {
                    setTasks(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch tasks:", error);
            }
        }

        loadTasks();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = ({ currentTarget: input }) => {
        setCurrentTask(input.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const nextTask = currentTask.trim();

        if (!nextTask) {
            return;
        }

        try {
            const { data } = await addTask({ task: nextTask });
            setTasks((previousTasks) => [data, ...previousTasks]);
            setCurrentTask("");
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    const handleUpdate = async (taskId) => {
        const previousTasks = tasks;
        const targetTask = previousTasks.find((task) => task._id === taskId);

        if (!targetTask) {
            return;
        }

        const updatedTasks = previousTasks.map((task) =>
            task._id === taskId
                ? { ...task, completed: !task.completed }
                : task
        );

        setTasks(updatedTasks);

        try {
            await updateTask(taskId, {
                completed: !targetTask.completed,
            });
        } catch (error) {
            setTasks(previousTasks);
            console.error("Failed to update task:", error);
        }
    };

    const handleDelete = async (taskId) => {
        const previousTasks = tasks;
        setTasks(previousTasks.filter((task) => task._id !== taskId));

        try {
            await deleteTask(taskId);
        } catch (error) {
            setTasks(previousTasks);
            console.error("Failed to delete task:", error);
        }
    };

    return {
        tasks,
        currentTask,
        handleChange,
        handleSubmit,
        handleUpdate,
        handleDelete,
    };
}

export default useCourses;
