import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

import ContactCTA from "./ContactCTA";

describe("ContactCTA", () => {
    test("renders the empty state and input controls", () => {
        const handleChange = jest.fn();
        const handleSubmit = jest.fn((event) => event.preventDefault());

        render(
            <ContactCTA
                tasks={[]}
                currentTask=""
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                handleUpdate={jest.fn()}
                handleDelete={jest.fn()}
            />
        );

        expect(
            screen.getByText("Enrollment Interest List")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Add your first course interest above")
        ).toBeInTheDocument();

        fireEvent.change(screen.getByLabelText("Interest List"), {
            target: { value: "Cloud Architect" },
        });
        expect(handleChange).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByLabelText("Add Interest"));
        expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    test("renders tasks and wires update/delete actions", () => {
        const handleUpdate = jest.fn();
        const handleDelete = jest.fn();
        const tasks = [
            { _id: "1", task: "DevOps Engineer", completed: false },
            { _id: "2", task: "Cloud Architect", completed: true },
        ];

        render(
            <ContactCTA
                tasks={tasks}
                currentTask=""
                handleChange={jest.fn()}
                handleSubmit={jest.fn()}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />
        );

        expect(
            screen.getByText("DevOps Engineer")
        ).toBeInTheDocument();
        expect(
            screen.getByText("Cloud Architect")
        ).toBeInTheDocument();

        fireEvent.click(screen.getAllByLabelText("Mark as Complete")[0]);
        expect(handleUpdate).toHaveBeenCalledWith("1");

        fireEvent.click(screen.getAllByLabelText("Delete Interest")[0]);
        expect(handleDelete).toHaveBeenCalledWith("1");
    });
});
