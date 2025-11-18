import React from "react";
import {
  BiensAddSchema,
  BienUpdateSchema,
} from "@/features/biens/schema/biens.schema";
import { useForm } from "react-hook-form";
import { z } from "zod/index";
import { zodResolver } from "@hookform/resolvers/zod";
import { BienCreateForm } from "@/components/(protected)/dashboard/biens/forms/bien-create-form";

function BienFormCreate(props) {
  const form = useForm<z.input<typeof BiensAddSchema>>({
    resolver: zodResolver(BiensAddSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "moana",
      categoryId: "",
      listingType: "RENT",
      price: "2000",
      secondaryPrice: "500",
      currency: "XOF",
      pricePeriod: "MONTH",
      cityId: "",
      area: "250",
      landArea: "500",
      rooms: 5,
      bedrooms: 2,
      bathrooms: 2,
      garages: 1,
      garageCapacity: 20,
      yearBuilt: 2020,
      addressLine1: "",
      addressLine2: "",
      amenities: [],
      images: [],
      video: undefined,
      coverImage: undefined,
    },
  });
  return (
    <BienCreateForm
      form={form}
    />
  );
}

export default BienFormCreate;