import { useRouter } from "next/router"
import React from "react"
import { User } from "../../types"
import Button from "../Button"

interface InfoCardProps {
  data: User
}
const InfoCard = ({ data }: InfoCardProps) => {
  const router = useRouter()
  return (
    <div className="info-table">
      <div className="head">
        <div>
          <h2>Profile</h2>
          <p>Some info may be visible to other people</p>
        </div>
        <div>
          <Button
            size="medium"
            variant="outline"
            onClick={() => router.push("/user/edit")}
          >
            Edit
          </Button>
        </div>
      </div>
      {Object.entries(data).map(([key, value], i) => (
        <div className="row" key={i}>
          <div className="name">{key}</div>
          {key === "avatar" ? (
            <div className="data avatar">
              <img src={value} alt="avatar" />
            </div>
          ) : (
            <div className="data">{value}</div>
          )}
        </div>
      ))}
      <style jsx>
        {`
          .info-table {
            border: 1px solid var(--clr-gray-2);
            border-radius: 12px;
            text-align: left;
          }
          h2 {
            letter-spacing: -0.035em;
            font-weight: 400;
            font-size: 1.5rem;
          }
          .row,
          .head {
            padding: 1.2rem 3rem;
          }
          .row {
            display: flex;
            align-content: center;
          }
          .row .name {
            min-width: 30%;
            text-transform: uppercase;
            color: var(--clr-gray-4);
          }
          .row .data {
            font-size: 1.2rem;
            color: var(--clr-text);
          }
          .row .avatar {
            width: 4.5rem;
            border-radius: 0.5rem;
            object-fit: contain;
            object-position: center;
          }
          img {
            border-radius: inherit;
          }
          .head p {
            font-size: 0.8rem;
            color: var(--clr-gray-1);
          }
          .head {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid var(--clr-gray-3);
          }
          .row + .row {
            border-top: 1px solid var(--clr-gray-2);
          }
          @media (max-width: 640px) {
            .info-table {
              border: 0;
              text-align: left;
            }
            .head {
              border: 0;
            }
            .row,
            .head {
              padding: 0.8rem 1rem;
            }
          }
        `}
      </style>
    </div>
  )
}

export default InfoCard
