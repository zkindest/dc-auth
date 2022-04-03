import { User } from "@prisma/client"
import { useAtom } from "jotai"
import Image from "next/image"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { userAtom } from "~/jotai/user"
import { getAuthFetchOptions } from "~/utils/auth"
import { getValidation, validPhone } from "~/utils/form-validation"
import Button from "../Button"
import FileInput from "../FileInput"
import Input from "../Input"
import TextArea from "../TextArea"

interface EditInfoCardProps {
  user: User
}
const EditInfoCard = ({ user }: EditInfoCardProps) => {
  const router = useRouter()
  const [_, setUser] = useAtom(userAtom)
  const {
    avatar: currentAvatar,
    id,
    password,
    email = "",
    ...editableTextFields
  } = user
  const ref = useRef<FileReader>()
  const [avatar, setAvatar] = useState(currentAvatar)
  const [imageUploaded, setImageUpload] = useState()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: editableTextFields,
  })

  useEffect(() => {
    // reset form values if slot info changes
    reset(editableTextFields)
  }, [user])

  const handleImageLoad = (e: ProgressEvent<FileReader>) => {
    if (e.target?.result) {
      setAvatar(e.target?.result as string)
    }
  }
  useEffect(() => {
    if (!ref.current) {
      ref.current = new FileReader()
    }
    ref.current?.addEventListener("load", handleImageLoad)
    return () => {
      ref.current?.removeEventListener("load", handleImageLoad)
    }
  }, [])
  const handleFileChange = (event: any) => {
    let file = event.target.files[0]
    if (!file.type.startsWith("image/")) {
      alert("invalid file type")
    }

    ref.current?.readAsDataURL(file)
    setImageUpload(file)
  }
  const onSubmit = async (data: any) => {
    const formData = new FormData()
    for (const key in data) {
      formData.append(key, data[key])
    }

    if (imageUploaded) {
      formData.append("avatar", imageUploaded)
    }

    try {
      const updatedUser = await (
        await fetch(`/api/user/${id}`, {
          method: "PUT",
          body: formData,
          ...getAuthFetchOptions(),
        })
      ).json()

      setUser(updatedUser.data)

      router.push("/user/info")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="info-table">
      <div className="head">
        <h2>Change Info</h2>
        <p>Changes will be reflected to every services</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="avatar">
          <div className="current">
            <Image
              src={avatar}
              alt={`${user?.name} avatar`}
              width={100}
              height={100}
            />
          </div>
          <FileInput
            accept="image/*"
            // {...register("avatar", {
            //   onChange: handleFileChange,
            // })}
            onChange={handleFileChange}
          />
        </div>
        <Input
          placeholder="Enter your name"
          label="Name"
          required
          {...register("name", getValidation({ name: "name" }))}
          error={"name" in errors ? errors["name"]?.message : ""}
        />
        <br />
        <TextArea
          placeholder="Enter your bio"
          label="Bio"
          {...register("bio", getValidation({ name: "bio", min: 50 }))}
          error={"bio" in errors ? errors["bio"]?.message : ""}
        />
        <br />
        <Input
          type="tel"
          placeholder="Enter your phone"
          label="Phone"
          error={"phone" in errors ? errors["phone"]?.message : ""}
          {...register("phone", validPhone)}
        />
        <br />
        {/* TODO: Implemetn email change */}
        {/* <Input
          placeholder="Enter your email"
          type={"email"}
          label="Email"
          {...register("email", getValidation({ name: "email" }))}
          error={"email" in errors ? errors["email"]?.message : ""}
        />
        <br /> */}
        {/* TODO: Implement change password */}
        {/* <Input
          placeholder="Enter your new password"
          label="Password"
          {...register(
            "password",
            getValidation({ name: "password", min: 6, max: 15 })
          )}
          error={"password" in errors ? errors["password"]?.message : ""}
        />
        <br /> */}
        <Button type="submit">Save</Button>
      </form>
      <style jsx>{`
        .info-table {
          border: 1px solid var(--clr-gray-2);
          border-radius: 12px;
          padding: 1.2rem 3rem;
        }
        h2 {
          letter-spacing: -0.035em;
          font-weight: 400;
          font-size: 1.5rem;
        }
        p {
          letter-spacing: -0.035em;
          font-weight: 400;
          margin-bottom: 2rem;
          font-size: 0.9rem;
        }
        .avatar {
          display: flex;
          align-items: center;
          margin: 0.5rem 0;
        }

        .avatar .current {
          width: 4.5rem;
          border-radius: 0.5rem;
          object-fit: contain;
          object-position: center;
          margin-right: 1rem;
        }
        img {
          border-radius: inherit;
        }
        button {
          margin-left: 1rem;
          color: var(--clr-gray-1);
          font-size: 0.9rem;
          background: none;
          border: 0;
          cursor: pointer;
        }
        form {
          margin: 2rem 0;
          width: 50%;
        }
        @media (max-width: 640px) {
          .info-table {
            border: 0;
            text-align: left;
            padding: 0;
          }
          form {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
export default EditInfoCard
