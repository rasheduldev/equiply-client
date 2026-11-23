import { HomeHero } from "@/components/home-hero";
import { FeaturedEquipment } from "@/components/home/FeaturedEquipment";
import { Categories } from "@/components/home/Categories";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { CustomerReviews } from "@/components/home/CustomerReviews";
import { HowItWorks } from "@/components/home/HowItWorks";
import { RecentEquipment } from "@/components/home/RecentEquipment";
import {
  getFeaturedEquipment,
  getRecentEquipment,
} from "@/lib/actions/equipments";
import type { Equipment } from "@/app/dashboard/owner/my-equipment/_lib/types";

export default async function Page() {
  let featuredEquipment: Equipment[] = [];
  let recentEquipment: Equipment[] = [];

  try {
    const [featured, recent] = await Promise.all([
      getFeaturedEquipment().catch(() => []),
      getRecentEquipment().catch(() => []),
    ]);

    featuredEquipment = Array.isArray(featured)
      ? featured
      : Array.isArray((featured as unknown as { data?: Equipment[] })?.data)
      ? (featured as unknown as { data: Equipment[] }).data
      : [];

    recentEquipment = Array.isArray(recent)
      ? recent
      : Array.isArray((recent as unknown as { data?: Equipment[] })?.data)
      ? (recent as unknown as { data: Equipment[] }).data
      : [];
  } catch (err) {
    console.error("Error loading home equipment:", err);
  }

  return (
    <main>
      <HomeHero />
      <FeaturedEquipment initialEquipment={featuredEquipment} />
      <Categories />
      <WhyChooseUs />
      <CustomerReviews />
      <HowItWorks />
      <RecentEquipment initialEquipment={recentEquipment} />
    </main>
  );
}
