import SearchBar from "./searchBar";

const Header = () => {
  return (
    <div className="md:h-64 bg-gradient-to-r from-[#0f1f47] to-[#5f6984] p-2">
      <div className="text-center mt-10">
        <h1 className="text-white text-[1.8em] md:text-5xl font-bold mb-2">
          Find your table for any occasion
        </h1>
        <SearchBar />
      </div>
    </div>
  );
};

export default Header;
