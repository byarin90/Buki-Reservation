import React from "react";

const Title = ({name}:{name:string}) => {
  return (
    <div className="mt-4 border-b pb-6">
      <h1 className="font-bold text-6xl">{name}</h1>
    </div>
  );
};

export default Title;
