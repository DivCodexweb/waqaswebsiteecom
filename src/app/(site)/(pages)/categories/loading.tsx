import Breadcrumb from "@/components/Common/Breadcrumb";

export default function CategoriesLoading() {
  return (
    <>
      <Breadcrumb title={"Categories"} pages={["Home", "/", "Categories"]} />
      <section className="overflow-hidden relative pb-20 pt-5 lg:pt-20 bg-[#f3f4f6]">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Loading Spinner & Animation */}
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-lg shadow-sm w-full">
            <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-dark font-medium text-base">Loading categories, please wait...</p>
          </div>
        </div>
      </section>
    </>
  );
}