/* Developed by Grafizen International PVT. LTD. */

'use client';

import { useMemo, useState } from 'react';
import { Checkbox } from '@/component/common/ui-product/checkbox';
import { Label } from '@/component/common/ui-product/label';
import {
  Droplets,
  Wheat,
  Leaf,
  Package,
  Sparkles,
  SlidersHorizontal,
  X,
  RotateCcw,
  Search,
} from 'lucide-react';

export function FilterSidebar({
  selectedCategories = [],
  onCategoryChange,
  categoryOptions = [],
  onClearFilters,
  isMobileOpen,
  onMobileClose,
  searchTerm = '',
  setSearchTerm,
  productCount = 0,
}) {

  const getCategoryIcon = (value = '') => {
    const v = (value || '').toLowerCase();

    if (v.includes('ghee')) return Droplets;
    if (v.includes('honey')) return Sparkles;
    if (v.includes('mix')) return Leaf;
    if (v.includes('flour')) return Wheat;
    if (v.includes('sweet') || v.includes('sugar')) return Package;

    return Package;
  };

  const filteredCategories = useMemo(() => {
    const search = (searchTerm || '').toLowerCase();
    return (categoryOptions || []).filter((item) =>
      (item?.label || item?.value || '').toLowerCase().includes(search)
    );
  }, [categoryOptions, searchTerm]);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] md:hidden z-40"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 md:top-24 left-0 z-50 md:z-auto
          h-screen md:h-fit w-[82%] max-w-[270px] md:w-64 lg:w-72
          transition-transform duration-300 ease-out
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="h-full md:h-auto overflow-y-auto  md:bg-transparent border-r md:border-r-0 border-[#0c776b]/10">
          <div className="p-4 md:p-4">
            <div className="relative overflow-hidden rounded-[15px] border border-[#0c776b]/10 bg-white shadow-[0_14px_40px_rgba(47,93,59,0.09)]">

              <div className="absolute -top-16 -right-16 h-36 w-36 rounded-full bg-[#9DBB5A]/20 blur-2xl" />
              <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-[#EAB308]/10 blur-2xl" />

              <div className="relative p-3 border-b border-[#0c776b]/10">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-[#0c776b]/8  py-1 text-[14px] font-bold uppercase tracking-[0.14em] text-[#0c776b]">
                      <SlidersHorizontal size={19} />
                      Filters
                    </div>

                        <p className="text-[12px] text-gray-600  font-medium">
        Showing{' '}
        <span className="font-bold text-[#0c776b]">
          {productCount}
        </span>{' '}
        {productCount === 1 ? 'product' : 'products'}
      </p>
                  </div>

                  <button
                    onClick={onMobileClose}
                    className="md:hidden grid h-8 w-8 place-items-center rounded-full bg-[#0c776b]/8 text-[#0c776b]"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="relative px-4 pt-4">
                <div className="relative">
                  <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0c776b]/70"
                  />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search category..."
                    className="
                      w-full rounded-[10px] border border-[#0c776b]/12 bg-[#fffdf7]
                      py-2 pl-9 pr-3 text-sm text-gray-700 outline-none
                      placeholder:text-gray-400
                      focus:border-[#0c776b]/35 focus:bg-white
                      cursor-text
                    "
                  />
                </div>
              </div>

              <div className="relative px-4 pt-3">
                <div className="rounded-[10px] bg-gradient-to-br from-[#0c776b] to-[#46794c] p-2 text-white shadow-md shadow-[#0c776b]/15">
                  <div className="flex items-center justify-between">
                    <div className=' flex items-center gap-[10px]'>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/70">
                        Active
                      </p>
                      <h4 className="text-xl font-bold leading-none mt-1">
                        {selectedCategories.length}
                      </h4>
                    </div>

                    <button
                      onClick={onClearFilters}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/25"
                    >
                      <RotateCcw size={12} />
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-[#0c776b]">
                    Categories
                  </h4>

                  <span className="rounded-full bg-[#0c776b]/8 px-2.5 py-1 text-[11px] font-semibold text-[#0c776b]">
                    {filteredCategories.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {filteredCategories.map((category) => {
                    const Icon = getCategoryIcon(category.value);
                    const isActive = selectedCategories.includes(category.value);

                    return (
                      <Label
                        key={category.value}
                        htmlFor={`category-${category.value}`}
                        className={`
                          group flex cursor-pointer items-center justify-between gap-2 rounded-[10px] border px-3  transition-all duration-300
                          ${
                            isActive
                              ? 'border-[#0c776b] bg-[#0c776b] text-white shadow-sm shadow-[#0c776b]/20'
                              : 'border-[#0c776b]/10 bg-[#fffdf7] text-gray-700 hover:border-[#0c776b]/25 hover:bg-[#0c776b]/5'
                          }
                        `}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`
                              grid h-8 w-8 place-items-center rounded-xl transition-all
                              ${
                                isActive
                                  ? 'bg-white/18 text-white'
                                  : 'bg-[#0c776b]/8 text-[#0c776b]'
                              }
                            `}
                          >
                            <Icon size={15} />
                          </span>

                          <span className="text-xs font-semibold">
                            {category.label}
                          </span>
                        </div>

                        <Checkbox
                          id={`category-${category.value}`}
                          checked={isActive}
                          onCheckedChange={() => onCategoryChange(category.value)}
                          className={`
                            h-4 w-4 rounded-md border
                            ${
                              isActive
                                ? 'border-white bg-white text-[#0c776b]'
                                : 'border-[#0c776b]/30'
                            }
                          `}
                        />
                      </Label>
                    );
                  })}

                  {filteredCategories.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-[#0c776b]/20 bg-[#0c776b]/5 p-3 text-center">
                      <p className="text-xs text-gray-500">
                        No category found.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </aside>
    </>
  );
}