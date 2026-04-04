import React, { Component } from "react";
import PageShell from "./components/layout/PageShell";
import Hero from "./components/sections/Hero";
import StatsStrip from "./components/sections/StatsStrip";
import LeadershipGrid from "./components/sections/LeadershipGrid";
import FeatureGrid from "./components/sections/FeatureGrid";
import ProgramCard from "./components/sections/ProgramCard";
import TestimonialCarousel from "./components/sections/TestimonialCarousel";
import SuccessStoryGrid from "./components/sections/SuccessStoryGrid";
import ContactCTA from "./components/sections/ContactCTA";
import { addTask, deleteTask, getTasks, updateTask } from "./services/taskServices";
import "./App.css";
import "./tailwind-output.css";

class App extends Component {
    state = { tasks: [], currentTask: "" };

    async componentDidMount() {
        try {
            const { data } = await getTasks();
            this.setState({ tasks: data });
        } catch (error) {
            console.error("Failed to fetch tasks:", error);
        }
    }

    handleChange = ({ currentTarget: input }) => {
        this.setState({ currentTask: input.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { currentTask, tasks: originalTasks } = this.state;

        try {
            const { data } = await addTask({ task: currentTask });
            this.setState({
                tasks: [...originalTasks, data],
                currentTask: ""
            });
        } catch (error) {
            console.error("Failed to add task:", error);
        }
    };

    handleUpdate = async (taskId) => {
        const { tasks: originalTasks } = this.state;
        const updatedTasks = originalTasks.map((task) => (
            task._id === taskId
                ? { ...task, completed: !task.completed }
                : task
        ));
        const updatedTask = updatedTasks.find((task) => task._id === taskId);

        this.setState({ tasks: updatedTasks });

        try {
            await updateTask(taskId, { completed: updatedTask.completed });
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.error("Failed to update task:", error);
        }
    };

    handleDelete = async (taskId) => {
        const { tasks: originalTasks } = this.state;
        const updatedTasks = originalTasks.filter((task) => task._id !== taskId);

        this.setState({ tasks: updatedTasks });

        try {
            await deleteTask(taskId);
        } catch (error) {
            this.setState({ tasks: originalTasks });
            console.error("Failed to delete task:", error);
        }
    };

    render() {
        const { tasks, currentTask } = this.state;

        return (
            <PageShell>
                <Hero />
                <ProgramCard />
                <StatsStrip />
                <FeatureGrid />
                <LeadershipGrid />
                <TestimonialCarousel />
                <SuccessStoryGrid />
                <ContactCTA
                    tasks={tasks}
                    currentTask={currentTask}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    handleUpdate={this.handleUpdate}
                    handleDelete={this.handleDelete}
                />
            </PageShell>
        );
    }
}
  
export default App;
