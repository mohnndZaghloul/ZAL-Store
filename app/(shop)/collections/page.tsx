import FilterSection from "@/components/shop/FilterSection";

type CollectionsPageProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const CollectionsPage = async ({ searchParams }: CollectionsPageProps) => {
  const { category = "" } = await searchParams;

  return (
    <main className="space-y-4 min-h-[50vh]">
      <FilterSection
        key={category}
        initialCategory={category}
      />
    </main>
  );
};

export default CollectionsPage;