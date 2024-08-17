import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "../ui/button";

const Home = () => {
  const { toast } = useToast();
  return (
    <>
      <Button
        onClick={() => {
          toast({
            title: "Scheduled: Catch up",
            description: "Friday, February 10, 2023 at 5:57 PM",
          });
        }}
      >
        Show Toast
      </Button>
      <div className="h-screen">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos alias
        architecto saepe accusamus iure nam, molestias dolorem velit dolorum
        vero similique et, pariatur debitis, voluptatibus illo omnis molestiae
        ex quo cumque ad perferendis provident commodi animi! Obcaecati aliquam
        quo, sapiente qui saepe est iste, voluptatem totam et officia,
        consequuntur voluptatibus. Culpa recusandae ducimus error cum quae harum
        quo repellat quas fugiat iusto laboriosam, repellendus eos ipsam. Nulla
        ipsum quasi distinctio nisi, iusto officia harum aliquid vel nobis
        saepe, aliquam, cum aut suscipit laudantium quo non repudiandae repellat
        deleniti dolores molestias numquam sit. Suscipit in quibusdam tenetur et
        quos officia, alias fugiat pariatur sed autem omnis dicta ab rerum,
        dolorem expedita. Aliquam, accusamus! Quam nemo non, quos praesentium
        labore ullam unde! Ut blanditiis quisquam placeat assumenda facere
        itaque quaerat vel ducimus deleniti nobis provident in, ullam rem quo
        culpa, maxime ipsum impedit neque minus! Voluptatibus eaque modi
        sapiente blanditiis quo deleniti nobis numquam enim aliquid voluptatum
        odio quis similique ullam, pariatur, error assumenda maxime. Ipsa
        repellendus, minima accusantium veniam accusamus placeat vitae, eaque
        cum suscipit officia fugiat ut quibusdam, cupiditate sequi quidem fugit
        natus! Perspiciatis ut cupiditate exercitationem! Quam exercitationem
        dolorum aspernatur, impedit illum consequatur incidunt voluptas
        voluptate commodi veritatis alias numquam nihil! Totam eum quos ratione
        minus consequuntur similique sit provident eos saepe mollitia ipsum
        tempore alias itaque asperiores fugit, excepturi voluptas odio? Ad ab a
        quasi, provident dignissimos, eaque est consequatur temporibus fuga
        possimus corporis saepe exercitationem eligendi cumque placeat, quod eos
        facilis rerum voluptate vel nemo voluptas. Soluta ad veniam explicabo
        repellendus fugit doloremque eaque quae, ducimus molestias illum
        perferendis quis. Voluptatem, cum quibusdam! Commodi molestiae porro
        autem atque, nisi deserunt consectetur illo sed totam, aliquid nesciunt.
        Repellendus, voluptatum eius et omnis sequi at voluptas harum suscipit
        reiciendis similique autem maxime, ratione error possimus ipsam amet
        animi excepturi quisquam illum quae recusandae nihil aspernatur iste.
        Dolorem quibusdam officia doloremque ab incidunt expedita temporibus,
        illum accusamus aliquam consequuntur, delectus ex eaque ipsa qui
        repellat sequi laudantium inventore magni omnis natus optio. Eligendi
        nisi voluptatibus, asperiores fugit magni iusto dolor autem ex nihil
        quibusdam voluptate sequi doloribus soluta dolore amet temporibus
        corporis inventore provident optio eos quaerat, laboriosam nostrum?
        Exercitationem similique vitae ab autem molestias harum eos aut fugiat
        saepe in rerum nisi enim, nam vel ullam eligendi libero maxime ex
        facilis laborum? Maiores cupiditate dolor harum optio ipsum nisi
        doloremque delectus nobis. Ullam labore iusto neque! Sit ab
        exercitationem officiis voluptatum harum asperiores, fugit odit,
        obcaecati unde eaque nostrum ad, doloribus repellendus sequi tenetur est
        enim expedita quos aut. Eius ab pariatur dolores consequuntur sapiente,
        laborum minus praesentium modi beatae quaerat sequi provident facilis
        molestias blanditiis quo excepturi harum ratione perferendis quam. Quam
        cum molestias laudantium architecto, facere numquam ipsam totam quaerat
        repudiandae similique, veritatis ex nemo excepturi voluptatem nihil,
        corrupti aperiam sapiente odit iusto minus eos quas at. Tempore eligendi
        dolore doloribus dolor provident, fugiat fugit laudantium facilis nihil
        modi voluptatem consequatur mollitia, repellendus expedita delectus vero
        deserunt voluptate qui a, maxime temporibus dolorem ullam aspernatur ut.
        Corporis?
      </div>
    </>
  );
};

export default Home;
