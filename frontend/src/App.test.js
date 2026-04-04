import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import App from "./App";
import {
    addTask,
    deleteTask,
    getTasks,
    updateTask,
} from "./services/taskServices";

jest.mock("./services/taskServices", () => ({
    getTasks: jest.fn(),
    addTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
}));

describe("App", () => {
    const originalConsoleError = console.error;

    beforeEach(() => {
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    afterEach(() => {
        console.error = originalConsoleError;
    });

    test("renders the landing page and supports task interactions", async () => {
        getTasks.mockResolvedValue({
            data: [{ _id: "1", task: "Cloud Architect", completed: false }],
        });
        addTask.mockResolvedValue({
            data: { _id: "2", task: "DevOps Engineer", completed: false },
        });
        updateTask.mockResolvedValue({});
        deleteTask.mockResolvedValue({});

        render(<App />);

        expect(
            screen.getByText(/Build Your/i)
        ).toBeInTheDocument();

        await waitFor(() =>
            expect(getTasks).toHaveBeenCalledTimes(1)
        );

        expect(
            screen.getByText("Cloud Architect")
        ).toBeInTheDocument();

        fireEvent.click(screen.getAllByLabelText("Mark as Complete")[0]);

        await waitFor(() =>
            expect(updateTask).toHaveBeenCalledWith("1", {
                completed: true,
            })
        );

        fireEvent.click(screen.getAllByLabelText("Delete Interest")[0]);

        await waitFor(() =>
            expect(deleteTask).toHaveBeenCalledWith("1")
        );
        expect(
            screen.queryByText("Cloud Architect")
        ).not.toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Interest List"), {
            target: { value: "  DevOps Engineer  " },
        });
        fireEvent.click(screen.getByLabelText("Add Interest"));

        await waitFor(() =>
            expect(addTask).toHaveBeenCalledWith({
                task: "DevOps Engineer",
            })
        );
        expect(
            screen.getByText("DevOps Engineer")
        ).toBeInTheDocument();
    });

    test("logs failures from the courses hook without crashing the app", async () => {
        getTasks.mockRejectedValue(new Error("network down"));

        render(<App />);

        await waitFor(() =>
            expect(console.error).toHaveBeenCalledWith(
                "Failed to fetch tasks:",
                expect.any(Error)
            )
        );

        expect(
            screen.getByText(/Enrollment Interest List/i)
        ).toBeInTheDocument();
    });
});
