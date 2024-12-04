import React, { useState } from "react";

type Props = {
    title: string;
    children: React.ReactNode;
};

const CollapsibleSection = (props: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="border rounded-lg shadow-md p-4">
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={toggleOpen}
            >
                <h2 className="text-lg font-bold">{props.title}</h2>
                <span className="text-xl">
                    {isOpen ? "▲" : "▼"}
                </span>
            </div>

            <div
                className={`transition-all duration-300 ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
            >
                <div className="mt-4">{props.children}</div>
            </div>
        </div>
    );
};

export default CollapsibleSection;
