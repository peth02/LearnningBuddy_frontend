"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  siblingCount?: number; // จำนวนปุ่มซ้ายขวาของหน้าปัจจุบัน (default: 1)
}

export default function Pagination({
  page,
  pageSize,
  totalCount,
  siblingCount = 1,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages <= 1) return null;

  // ฟังก์ชันสร้าง URL
  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Logic การสร้าง Array เลขหน้า พร้อม ...
  const generatePagination = () => {
    // ถ้าจำนวนหน้าน้อย (เช่น < 7) แสดงหมดเลย
    if (totalPages <= 5 + siblingCount * 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 1);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    // Case 1: มี ... ทางขวาอย่างเดียว (อยู่หน้าแรกๆ)
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // Case 2: มี ... ทางซ้ายอย่างเดียว (อยู่หน้าท้ายๆ)
    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, "...", ...rightRange];
    }

    // Case 3: มี ... ทั้งสองฝั่ง (อยู่ตรงกลาง)
    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, "...", ...middleRange, "...", totalPages];
    }

    return [];
  };

  const paginationRange = generatePagination();

  // Styles
  const baseClass =
    "h-8 min-w-8 px-2 border rounded flex items-center justify-center text-sm transition-colors";
  const activeClass = "bg-blue-600 text-white border-blue-600";
  const inactiveClass = "hover:bg-gray-100 text-gray-700 bg-white";
  const disabledClass =
    "opacity-40 cursor-not-allowed text-gray-400 bg-gray-50";
  const dotsClass = "px-2 text-gray-400 select-none"; // Style สำหรับ ...

  return (
    <div className="flex items-center justify-center gap-1 mt-6 select-none">
      {/* Prev Button */}
      {page <= 1 ? (
        <span className={`${baseClass} ${disabledClass}`}>Prev</span>
      ) : (
        <Link
          href={createPageURL(page - 1)}
          className={`${baseClass} ${inactiveClass}`}
        >
          Prev
        </Link>
      )}

      {/* Render Pages */}
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === "...") {
          return (
            <span key={`dots-${index}`} className={dotsClass}>
              ...
            </span>
          );
        }

        return (
          <Link
            key={pageNumber}
            href={createPageURL(pageNumber)}
            className={`${baseClass} ${
              pageNumber === page ? activeClass : inactiveClass
            }`}
          >
            {pageNumber}
          </Link>
        );
      })}

      {/* Next Button */}
      {page >= totalPages ? (
        <span className={`${baseClass} ${disabledClass}`}>Next</span>
      ) : (
        <Link
          href={createPageURL(page + 1)}
          className={`${baseClass} ${inactiveClass}`}
        >
          Next
        </Link>
      )}
    </div>
  );
}

export function PaginationTemp({ page, pageSize, totalCount }: PaginationProps) {

    const totalPages = Math.floor(totalCount/pageSize);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    console.log(page, pageSize, totalCount, totalPages)

    const createPageURL = (pageNumber: number | string) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };
    const getPages = () => {
        if (totalPages < 10) {
            return Array.from(new Array(20), (x, i) => i + 1);
        } else if (totalPages >= 10) {
            if (page <= 3) {
                return [1,2,3,4,5,"..."]
            }
            if (totalPages-2 <= page && page <= totalPages) {
                return ["...", totalPages-4, totalPages-3, totalPages-2, totalPages-1, totalPages]
            }
            return ["...", page-2, page-1, page, page+1, page+2, "..."]
        }
        return []
    }
    const pages = getPages()
    console.log(pages)
    return (
        <nav className="flex gap-10 w-[120px]">
            <Link href={createPageURL(1)} className={page==1?"text-red-500":"text-black-500"}>First</Link>
            <Link href={createPageURL(page-1)} className={page==1?"text-red-500":"text-black-500"}>Prev</Link>
            { pages.map((i)=> {
                if (i == "..."){
                    return <span key={`dots-${i}`+1}>...</span>
                }
                return <Link key={i} href={createPageURL(i)} className={i==page?"text-red-500":"text-black-500"}>{i}</Link>
            })}
            <Link href={createPageURL(page+1)} className={page==totalPages?"text-red-500":"text-black-500"}>Next</Link>
            <Link href={createPageURL(totalPages)} className={page==totalPages?"text-red-500":"text-black-500"}>Last</Link>
        </nav>
    );
}