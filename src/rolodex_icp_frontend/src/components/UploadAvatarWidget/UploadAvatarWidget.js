import React, { useRef, useState } from "react";
import ReactCrop from "react-image-crop";
import Dropzone from "react-dropzone";

import s from "./UploadAvatarWidget.module.scss";

import EmptyUserAvatar from "../icons/EmptyUserAvatar";
import ConfirmDialog from "../ConfirmDialog/ConfirmDialog";

export default function UploadAvatarWidget({ avatar, onUploadComplete }) {
	const [crop, setCrop] = useState({ unit: "%", width: 100, aspect: 1 });
	const [src, setSrc] = useState(null);
	const [image, setImage] = useState(null);
	const [croppedImageUrl, setCroppedImageUrl] = useState(null);
	const [selectedFileName, setSelectedFileName] = useState("");

	const accept = { accept: [".png,.jpeg,.jpg"] };
	let logoRef = useRef();

	// ------------------------------------- METHODS -------------------------------------
	const _getCroppedImg = ({ image, crop, fileName }) => {
		const canvas = document.createElement("canvas");
		const pixelRatio = window.devicePixelRatio;
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		const ctx = canvas.getContext("2d");

		canvas.width = crop.width * pixelRatio * scaleX;
		canvas.height = crop.height * pixelRatio * scaleY;

		ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
		ctx.imageSmoothingQuality = "high";

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width * scaleX,
			crop.height * scaleY
		);

		return new Promise((resolve) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						console.error("Canvas is empty");
						return;
					}
					blob.name = fileName;
					const fileUrl = window.URL.createObjectURL(blob);
					resolve(fileUrl);
				},
				"image/png",
				1
			);
		});
	};

	const makeClientCrop = async () => {
		if (image && crop.width && crop.height) {
			const croppedImageUrl = await _getCroppedImg({
				image: image,
				crop,
				fileName: selectedFileName,
			});

			setCroppedImageUrl(croppedImageUrl);
			setSrc(null);

			if (onUploadComplete) {
				onUploadComplete(croppedImageUrl);
			}
		}
	};

	const onSelectFile = (files) => {
		if (files && files.length > 0) {
			const reader = new FileReader();
			reader.addEventListener("load", () => {
				setSrc(reader.result);
				setSelectedFileName(files[0].name);
			});
			reader.readAsDataURL(files[0]);
		}
	};

	return (
		<div className={s.root}>
			{src && (
				<ConfirmDialog
					isOpen={true}
					title="Crop & Center Profile Image"
					toggle={() => setSrc(null)}
					buttons={[
						{
							action: makeClientCrop,
							text: "Use This Profile Image",
						},
					]}
				>
					<div className={s.content}>
						<ReactCrop
							circularCrop
							src={src}
							crop={crop}
							onImageLoaded={(img) => setImage(img)}
							onChange={(c) => setCrop(c)}
						/>
					</div>
				</ConfirmDialog>
			)}

			<div onClick={() => logoRef.click()}>
				<Dropzone
					onDrop={onSelectFile}
					multiple={false}
					accept={accept}
					minSize={0}
				>
					{(dropzoneProps) => {
						const { getRootProps, getInputProps } = dropzoneProps;

						return (
							<div {...getRootProps()} className={s.avatarContainer}>
								{croppedImageUrl ? (
									<img alt="Cropped" src={croppedImageUrl} />
								) : avatar ? (
									<img src={avatar} alt="avatar" />
								) : (
									<EmptyUserAvatar width={160} height={160} />
								)}

								<input {...getInputProps()} ref={(elem) => (logoRef = elem)} />
							</div>
						);
					}}
				</Dropzone>
			</div>
		</div>
	);
}
