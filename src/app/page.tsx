/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Navbar from "@/components/Navbar";
import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";
import messages from "@/messages.json";

const Home = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 text-indigo-950">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl tracking-tight text-indigo-900">
            Dive into the World Of True Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg text-indigo-950">
            Explore True Feedback - Where Your Identity Remains Truely Anonymous
          </p>
        </section>

        <Carousel
          plugins={[AutoPlay({ delay: 2000 })]}
          className="w-full max-w-xs "
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Card>
                    <CardHeader>{message.title}</CardHeader>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-lg">{message.content}</span>
                    </CardContent>
                    <CardFooter>
                      <span className="text-sm">{message.received}</span>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-center p-4 md:p-6">
        <span className="text-sm text-indigo-950">
          ©2023 True Feedback. All Rights Reserved.
        </span>
      </footer>
    </>
  );
};

export default Home;
