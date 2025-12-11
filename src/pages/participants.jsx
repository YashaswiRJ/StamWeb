import participants from "../data/participants.json";
import bgImage from "../assets/home_background.jpg";

export default function Participants() {
  return (
    <div
      className="min-h-screen text-white"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(10,10,20,0.95), rgba(0,0,0,0.9)),
          url(${bgImage})
        `,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* HEADER */}
      <div className="pt-32 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">
          Past Participants
        </h1>
        <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
          Celebrating problem solvers who took on our flagship competitions.
        </p>
      </div>

      {/* MATHEMANIA SECTION */}
      <Section
        title="Mathemania"
        subtitle="Past participants of Mathemania"
        data={participants.mathemania}
      />

      {/* INTEGRATION BEE SECTION */}
      <Section
        title="Integration Bee"
        subtitle="Past participants of Integration Bee"
        data={participants.integrationBee}
      />

      <div className="h-24" />
    </div>
  );
}

/* ---------------- SECTION COMPONENT ---------------- */

function Section({ title, subtitle, data }) {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-20">
      <h2 className="text-3xl font-semibold">{title}</h2>
      <p className="text-gray-400 mt-2">{subtitle}</p>

      <div className="grid gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data.map((person, idx) => (
          <ParticipantCard key={idx} {...person} />
        ))}
      </div>
    </div>
  );
}

/* ---------------- CARD COMPONENT ---------------- */

function ParticipantCard({ name, year, achievement, image }) {
  return (
    <div className="
      backdrop-blur-md bg-white/5 border border-white/10
      rounded-xl overflow-hidden
      transition-all duration-300
      hover:scale-[1.04] hover:border-white/30
    ">
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-400">{year}</p>
        <p className="mt-2 text-sm text-gray-300">
          {achievement}
        </p>
      </div>
    </div>
  );
}
