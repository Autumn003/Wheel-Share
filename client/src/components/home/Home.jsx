import React, { useState } from "react";
import { MetaData, SearchRide } from "..";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HandCoins, Hourglass, Sprout } from "lucide-react";

const TruncatedDescription = ({ description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const renderDescription = () => {
    const words = description.split(" ");
    if (isExpanded) {
      return description;
    } else {
      return words.length > 20
        ? `${words.slice(0, 20).join(" ")}...`
        : description;
    }
  };

  return (
    <div>
      <p className="text-gray-500">{renderDescription()}</p>
      {description.split(" ").length > 20 && (
        <button className="text-blue-500" onClick={toggleDescription}>
          {isExpanded ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
};

const Home = () => {
  return (
    <>
      <MetaData title="Wheel Share" />
      <div className="md:h-60 h-28">
        <AspectRatio ratio={4 / 1}>
          <img
            src="/banner2.png"
            alt="Banner"
            className="object-cover w-full md:h-60 h-28"
          />
        </AspectRatio>
      </div>
      <div className=" md:m-10 m-5 ">
        <SearchRide />
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-5 md:m-14 m-6">
        <Card className="w-full border-none">
          <CardHeader>
            <CardTitle>
              <Sprout className="size-10 mx-3 -mb-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg my-2">Eco-friendly travel made easy</p>
            <CardDescription>
              Reduce your carbon footprint by carpooling! Every shared ride
              helps the environment, and with our seamless platform, it’s easier
              than ever to make a difference.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="w-full border-none">
          <CardHeader>
            <CardTitle>
              <Hourglass className="size-9 mx-3 -mb-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg my-2">Get there faster, together</p>
            <CardDescription>
              Save time and avoid traffic by carpooling in HOV lanes. Our
              platform connects you with other riders so you can take the
              fastest routes available.
            </CardDescription>
          </CardContent>
        </Card>
        <Card className="w-full border-none">
          <CardHeader>
            <CardTitle>
              <HandCoins className="size-10 mx-3 -mb-2" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg my-2">Save time, save money</p>
            <CardDescription>
              With our smart ride-sharing options, you can cut down on both
              travel costs and time spent commuting. Share a ride with others
              headed in the same direction, and enjoy the savings!
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="flex md:flex-row flex-col items-center md:px-14 px-5 bg-primary-foreground">
        <div className="w-full md:p-14 p-4 flex flex-col">
          <h1 className="text-xl font-semibold my-4">Earn while you drive</h1>
          <p className="text-gray-500 my-1">
            Share your trip and offset your driving costs! By offering a ride,
            you can earn rewards while helping others get where they need to go.
          </p>
          <Link
            to="/create-ride"
            className="self-center my-5 rounded-full bg-sky-500 hover:bg-sky-600 text-white duration-150 text-md py-3 px-4 font-semibold"
          >
            Offer a ride
          </Link>
        </div>
        <div className="w-full">
          <img src="/family3.png" alt="" className="h-52 mx-auto" />
        </div>
      </div>

      <div className="md:m-14 m-10">
        <h1 className="text-4xl font-semibold my-12 text-center">
          Carpool Help Centre
        </h1>
        <div className="flex flex-col md:flex-row gap-16 my-5">
          <div className="w-full">
            <h3 className="my-3 font-semibold text-lg">
              How do I book a carpool ride?
            </h3>
            <TruncatedDescription
              description="You can book a carpool ride on our web application. Simply search
              for your destination, choose the date you want to travel and pick
              the carpool that suits you best! Rides can be booked instantly.
              Either way, booking a carpool ride is fast, simple and easy."
            />
          </div>
          <div className="w-full">
            <h3 className="my-3 font-semibold text-lg">
              How do I publish a carpool ride?
            </h3>
            <TruncatedDescription
              description="Offering a carpool ride is easy. To publish your ride, juat
              indicate your departure and arrival points, the date and time of
              your departure, how many passengers you can take and the price per
              seat.and you have the option of adding any important details you
              think your passengers should know about. Then tap Create ride’ and
              you’re done!"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-16 my-5">
          <div className="w-full">
            <h3 className="my-3 font-semibold text-lg">
              How do I cancel my carpool ride?
            </h3>
            <TruncatedDescription
              description="If you have a change of plans, you can always cancel your carpool
              ride from the ‘Your rides’ section of our app. The sooner you
              cancel, the better. That way the driver has time to accept new
              passengers."
            />
          </div>
          <div className="w-full">
            <h3 className="my-3 font-semibold text-lg">
              What are the benefits of travelling by carpool?
            </h3>
            <TruncatedDescription
              description="There are multiple advantages to carpooling, over other means of
              transport. Travelling by carpool is usually more affordable,
              especially for longer distances. Carpooling is also more
              eco-friendly, as sharing a car means there will be fewer cars on
              the road, and therefore fewer emissions. Taking a carpool ride is
              also a safe way to travel in the current times. Because there are
              only a few people in a car, you have fewer points of contact and
              there’s less risk than other travel options."
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-16 my-5">
          <div className="w-full">
            <h3 className="my-3 font-semibold text-lg">
              How much does a carpool ride cost?
            </h3>
            <TruncatedDescription
              description="The costs of a carpool ride can vary greatly, and depend on
              factors like distance, time of departure, the demand of that ride
              and more. It is also up to the driver to decide how much to charge
              per seat, so it’s hard to put an exact price tag on a ride. Start
              searching for your next carpool ride."
            />
          </div>
          <div className="w-full">
            <h3 className="my-3 font-semibold text-lg">
              How do I start carpooling?
            </h3>
            <TruncatedDescription
              description="Carpooling with us is super easy, and free! Simply sign up for an
              account and tell us some basic details about yourself. Once you
              have an account, you can start booking or publishing rides
              directly on our website."
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
