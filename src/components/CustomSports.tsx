import sportsData from "../data/sports_data.json";
import { Data, Sport } from "./SportsPage";

export default function CustomSportsPage({ name }: { name: string }) {
  const obj = (sportsData as Data).sports;
  const sportsDetails: Sport = obj[name];
  if (!sportsDetails)
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-black text-white">
        <h2 className="font-bold text-xl">No such Course Offered Now</h2>
      </div>
    );
  return (
    <div className="sport-detail-container">
      <div className="sport-header">
        <img
          src={sportsDetails.imageUrl}
          alt={sportsDetails.name}
          className="sport-image"
        />
        <h1>{sportsDetails.name}</h1>
      </div>
      <p>
        <strong>Description: </strong>
        {sportsDetails.description}
      </p>
      <p>
        <strong>Fee: </strong>${sportsDetails.fee}
      </p>
      <p>
        <strong>Achievements: </strong>
      </p>
      <ul>
        {sportsDetails.achievements.map((achievement, index) => (
          <li key={index}>{achievement}</li>
        ))}
      </ul>
      <p>
        <strong>Instructors: </strong>
      </p>
      <ul>
        {sportsDetails.instructors.map((instructor, index) => (
          <li key={index}>{instructor.name}</li>
        ))}
      </ul>
      {sportsDetails.isFeatured && (
        <div className="featured-badge">Featured Sport</div>
      )}
    </div>
  );
}
