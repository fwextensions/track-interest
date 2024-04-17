"use client";

import type { DragEvent } from "react";
import React, { createContext, useContext, useState } from "react";
import styles from "./DragOverlay.module.css";

const DroppedFileContext = createContext<File | undefined>(undefined);

export function useDroppedFile()
{
	return useContext(DroppedFileContext);
}

type DropTargetProps = {
	message: string;
	onDrop: (event: DragEvent<HTMLDivElement>) => void;
	onLeave: () => void;
};

function DropTarget({
	message,
	onDrop,
	onLeave }: DropTargetProps)
{
	return (
		<div
			className={styles.dropTarget}
				// we have to prevent the default dragOver behavior for the drop to work
			onDragOver={(event) => event.preventDefault()}
			onDrop={onDrop}
			onDragLeave={onLeave}
		>
			<div>
				{message}
			</div>
		</div>
	);
}

type Props = {
	message?: string;
	children: React.ReactNode;
}

export default function DragOverlay({
	message = "Drop a file here",
	children }: Props)
{
	const [showDropTarget, setShowDropTarget] = useState(false);
	const [file, setFile] = useState<File | undefined>();

	const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
			// don't show the drop target if the user is not dragging a file
		if (event.dataTransfer.types.includes("Files")) {
			setShowDropTarget(true);

				// we have to prevent the default dragEnter behavior so the drop works
			event.preventDefault();
		}
	};

	const handleDragLeave = () => setShowDropTarget(false);

	const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation()
		setShowDropTarget(false);

		if (event.dataTransfer.types.includes("Files")) {
			setFile(event.dataTransfer.files[0]);
		}
	};

	return (
		<div
			className={styles.dropContainer}
			onDragEnter={handleDragEnter}
		>
			<DroppedFileContext.Provider value={file}>
				{children}
			</DroppedFileContext.Provider>
			{showDropTarget &&
				<DropTarget
					message={message}
					onDrop={handleDrop}
					onLeave={handleDragLeave}
				/>
			}
		</div>
	);
}
