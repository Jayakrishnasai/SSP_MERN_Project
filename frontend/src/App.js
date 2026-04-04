import React from "react";

import PageShell from "./components/layout/PageShell";
import ContactCTA from "./components/sections/ContactCTA";
import FeatureGrid from "./components/sections/FeatureGrid";
import Hero from "./components/sections/Hero";
import LeadershipGrid from "./components/sections/LeadershipGrid";
import ProgramCard from "./components/sections/ProgramCard";
import StatsStrip from "./components/sections/StatsStrip";
import SuccessStoryGrid from "./components/sections/SuccessStoryGrid";
import TestimonialCarousel from "./components/sections/TestimonialCarousel";
import useCourses from "./courses";
import "./App.css";
import "./tailwind-output.css";

function App() {
    const {
        tasks,
        currentTask,
        handleChange,
        handleSubmit,
        handleUpdate,
        handleDelete,
    } = useCourses();

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
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />
        </PageShell>
    );
}

export default App;
