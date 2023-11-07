import { FC } from "react";

const DiscountBadge: FC = () => {
  return (
    <p className="bg-[#FAE387] text-[#303030] w-fit rounded-[5px] px-2 py-[4px] text-sm font-semibold">
      {"Buy once, use forever"}
    </p>
  );
};

export default DiscountBadge;
