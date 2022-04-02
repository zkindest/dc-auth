import React from "react"
import Button from "../Button"
import Input from "../Input"
import TextArea from "../TextArea"

const EditInfoCard = () => {
  return (
    <div className="info-table">
      <div className="head">
        <h2>Change Info</h2>
        <p>Changes will be reflected to every services</p>
      </div>
      <div className="avatar">
        <div className="current">
          <img src="/1.png" alt="avatar" />
        </div>
        <button>CHANGE PHOTO</button>
      </div>
      <form>
        <Input placeholder="Enter your name" label="Name" />
        <br />
        <TextArea placeholder="Enter your bio" label="Bio" />
        <br />
        <Input placeholder="Enter your phone" label="Phone" />
        <br />
        <Input placeholder="Enter your email" label="Email" />
        <br />
        <Input placeholder="Enter your new password" label="Password" />
        <br />
        <Button>Save</Button>
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
        }
        .avatar .current {
          width: 4.5rem;
          border-radius: 0.5rem;
          object-fit: contain;
          object-position: center;
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
