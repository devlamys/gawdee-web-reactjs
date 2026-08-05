/* Developed by Grafizen International PVT. LTD. */
'use client';

import { useMemo, useState } from 'react';
import {
  FileText,
  Leaf,
  ChefHat,
  ShieldCheck,
  Archive,
  CheckCircle2,
} from 'lucide-react';

export default function ProductDescription({ product }) {
  const [activeSection, setActiveSection] = useState('description');

  const getValue = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    return item?.value || '';
  };

  const details = useMemo(() => {
    const info = product?.productInfoSection || {};

    return {
      descriptionTitle:
        info?.descriptionTitle || 'Product Description',

      description:
        info?.description ||
        `Crafted with care, this product is made to deliver purity, quality, and an authentic everyday experience. It is thoughtfully prepared to preserve its natural goodness, making it a reliable addition to your daily lifestyle.`,

      description2:
        info?.description2 ||
        `Its carefully selected ingredients and traditional preparation method help maintain better taste, texture, and nutritional value. Designed for modern households while respecting traditional wisdom.`,

      comparisonRows:
        info?.comparisonRows?.length > 0
          ? info.comparisonRows
          : [
            {
              label: 'Gluten content',
              value1: '6.78%',
              value2: '11.21%',
            },
            {
              label: 'Dietary fibre',
              value1: '7.84%',
              value2: '3.10%',
            },
          ],

      comparisonHeadings:
        info?.comparisonHeadings || {
          col1: 'Ancient grain sample',
          col2: 'Modern wheat flour sample',
        },

      ingredients:
        info?.ingredients?.length > 0
          ? info.ingredients
          : ['Khapli / Emmer Wheat'],

      usageIntro:
        info?.usageIntro ||
        'Nutty and slightly sweet with a rich texture that works beautifully in daily meals.',

      usageBlocks:
        info?.usageBlocks?.length > 0
          ? info.usageBlocks
          : [
            {
              title: 'Roti / Chapati Making',
              points: [
                'Mix flour with water and knead into a soft dough.',
                'Let the dough rest for 10–15 minutes.',
                'Roll evenly and cook on a preheated tawa.',
                'Serve hot with ghee or curry.',
              ],
            },
            {
              title: 'Baking & Healthy Recipes',
              points: [
                'Use for breads, pancakes, and wholesome baked recipes.',
                'Adjust water slightly as texture may vary from refined flour.',
                'Works well in rustic and fibre-rich preparations.',
              ],
            },
          ],

      benefits:
        info?.benefits?.length > 0
          ? info.benefits
          : [
            'Naturally rich and wholesome',
            'Supports a balanced daily diet',
            'Traditional grain-based nutrition',
            'Good source of dietary fibre',
            'Crafted for better taste and texture',
          ],

      storage:
        info?.storage ||
        'Store in an airtight container in a cool, dry place away from direct sunlight.',
    };
  }, [product]);

  const navItems = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'ingredients', label: 'Ingredients', icon: Leaf },
    { id: 'usage', label: 'Usage Info', icon: ChefHat },
    { id: 'benefits', label: 'Benefits', icon: ShieldCheck },
    { id: 'storage', label: 'Storage', icon: Archive },
  ];

  const activeItem = navItems.find((item) => item.id === activeSection);

  return (
    <section className="pb-6 pt-20">
      <div className="max-w-7xl mx-auto w-[92%] lg:w-[92%]">
        <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] gap-4 lg:gap-6">

          <div className="xl:sticky xl:top-28 h-fit">
            <div className="rounded-[13px] border border-[#0c776b]/50 bg-white p-5 shadow-[0_15px_40px_rgba(47,93,59,0.06)]">
              <h3 className="text-lg font-bold text-[#1f2f24]">
                Quick Summary
              </h3>

              <div className="mt-3 space-y-3">
                <div className="rounded-[10px] bg-[#0c776b]/5 p-2">
                  <p className="text-[8px] uppercase tracking-[0.14em] text-[#0c776b]/70">
                    Active Section
                  </p>

                  <p className="mt-0 text-lg font-bold text-[#0c776b]">
                    {activeItem?.label}
                  </p>
                </div>

                <div className=" grid-cols-2 grid   gap-[10px] lg:grid-cols-1 lg:space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`
                          w-full cursor-pointer rounded-[10px] border px-4 py-3 text-left text-sm font-medium transition-all duration-300
                          ${isActive
                            ? 'border-[#0c776b] bg-[#0c776b] text-white shadow-sm shadow-[#0c776b]/20'
                            : 'border-[#0c776b]/10 bg-white text-gray-700 hover:border-[#0c776b]/25 hover:bg-[#0c776b]/5'
                          }
                        `}
                      >
                        <span className="flex items-center gap-2">
                          <Icon size={15} />
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>
          </div>

          <div className="min-h-[420px]">

            {activeSection === 'description' && (
              <div className="rounded-[13px] border border-[#0c776b]/10 bg-white  p-[14px] lg:p-6 shadow-[0_15px_40px_rgba(47,93,59,0.06)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="grid h-11 w-11 place-items-center border rounded-[9px] bg-[#0c776b]/8 text-[#0c776b]">
                    <FileText size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0c776b]/70">
                      Description
                    </p>

                    <h3 className="text-[14px] md:text-2xl font-[600] text-[#1f2f24]">
                      {details.descriptionTitle}
                    </h3>
                  </div>
                </div>

                <div className=" space-y-1 lg:space-y-4 text-[12px] lg:text-[15px] lg:leading-6 text-gray-600">
                  <p>{details.description}</p>
                  <p>{details.description2}</p>
                </div>

                {details.comparisonRows?.length > 0 && (
                  <div className=" mt-4 lg:mt-7 overflow-x-auto rounded-xl border border-[#0c776b]/10">
                    <div className="lg:min-w-[620px] min-w-[400px]">
                      <div className="grid grid-cols-3 bg-[#f7f8f2] text-sm font-semibold text-[#1f2f24]">
                        <div className="lg:p-4 lg:text-[15px] text-[13px] px-[15px] py-[15px]  border-b border-r border-[#0c776b]/10">
                          Nutritional Point
                        </div>

                        <div className="lg:p-4 lg:text-[15px] text-[13px] px-[15px] py-[15px]  border-b border-r border-[#0c776b]/10">
                          {details.comparisonHeadings?.col1}
                        </div>

                        <div className="lg:p-4 lg:text-[15px] text-[13px] px-[15px] py-[15px]  border-b border-r border-[#0c776b]/10">
                          {details.comparisonHeadings?.col2}
                        </div>
                      </div>

                      {details.comparisonRows.map((row, i) => (
                        <div
                          key={row?.id || i}
                          className="grid grid-cols-3 text-sm text-gray-700"
                        >
                          <div className="lg:p-4 lg:text-[15px] text-[13px] px-[15px] py-[10px] border-r border-b border-[#0c776b]/10 bg-white font-medium">
                            {row?.label}
                          </div>

                          <div className="lg:p-4 lg:text-[15px] text-[13px] px-[15px] py-[10px] border-r border-b border-[#0c776b]/10">
                            {row?.value1}
                          </div>

                          <div className="lg:p-4 lg:text-[15px] text-[13px] px-[15px] py-[10px] border-b border-[#0c776b]/10">
                            {row?.value2}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === 'ingredients' && (
              <div className="rounded-[13px] border border-[#0c776b]/10 bg-white p-6 shadow-[0_15px_40px_rgba(47,93,59,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-11 w-11 place-items-center border rounded-[9px] bg-[#0c776b]/8 text-[#0c776b]">
                    <Leaf size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0c776b]/70">
                      Ingredients
                    </p>

                    <h3 className="text-xl md:text-2xl font-[600] text-[#1f2f24]">
                      Pure & Simple Ingredients
                    </h3>
                  </div>
                </div>

                <p className="mb-5 text-sm leading-7 text-gray-600">
                  Made with simple and clean ingredients to maintain natural quality and everyday usability.
                </p>

                <div className="flex flex-wrap gap-3">
                  {details.ingredients.map((item, i) => (
                    <span
                      key={item?.id || i}
                      className="rounded-full border border-[#0c776b]/12 bg-[#0c776b]/5 px-4 py-1 text-sm font-medium text-[#0c776b]"
                    >
                      {getValue(item)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'usage' && (
              <div className="rounded-[13px] border border-[#0c776b]/10 bg-white p-6 shadow-[0_15px_40px_rgba(47,93,59,0.06)]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="grid h-11 w-11 place-items-center border rounded-[9px] bg-[#0c776b]/8 text-[#0c776b]">
                    <ChefHat size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0c776b]/70">
                      Usage Info
                    </p>

                    <h3 className="text-xl md:text-2xl font-bold text-[#1f2f24]">
                      How To Use
                    </h3>
                  </div>
                </div>

                <p className="text-[15px] leading-7 text-gray-600 mb-4">
                  {details.usageIntro}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {details.usageBlocks.map((block, idx) => (
                    <div
                      key={block?.id || idx}
                      className="rounded-2xl border border-[#0c776b]/10 bg-[#fcfcf8] p-4"
                    >
                      <h4 className="text-lg font-semibold text-[#1f2f24] mb-3">
                        {block?.title}
                      </h4>

                      <ul className="space-y-2">
                        {(block?.points || []).map((point, i) => (
                          <li key={point?.id || i} className="flex items-start gap-3">
                            <span className="mt-1 grid h-5 w-5 min-w-5 place-items-center rounded-full bg-[#0c776b] text-white text-[10px] font-bold">
                              {i + 1}
                            </span>

                            <span className="text-sm leading-5 text-gray-600">
                              {getValue(point)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'benefits' && (
              <div className="rounded-[13px] border border-[#0c776b]/10 bg-white p-6 shadow-[0_15px_40px_rgba(47,93,59,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-11 w-11 place-items-center border rounded-[9px] bg-[#0c776b]/8 text-[#0c776b]">
                    <ShieldCheck size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0c776b]/70">
                      Benefits
                    </p>

                    <h3 className="text-xl md:text-2xl font-bold text-[#1f2f24]">
                      Why It’s a Good Choice
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {details.benefits.map((item, i) => (
                    <div
                      key={item?.id || i}
                      className="flex items-start gap-3 rounded-xl border border-[#0c776b]/10 bg-[#fcfcf8] p-3"
                    >
                      <CheckCircle2
                        size={18}
                        className="text-[#0c776b] mt-0.5 min-w-[18px]"
                      />

                      <p className="text-sm leading-6 text-gray-600">
                        {getValue(item)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'storage' && (
              <div className="rounded-[13px] border border-[#0c776b]/10 bg-white p-6 shadow-[0_15px_40px_rgba(47,93,59,0.06)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="grid h-11 w-11 place-items-center border rounded-[9px] bg-[#0c776b]/8 text-[#0c776b]">
                    <Archive size={20} />
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0c776b]/70">
                      Storage
                    </p>

                    <h3 className="text-xl md:text-2xl font-bold text-[#1f2f24]">
                      Storage Information
                    </h3>
                  </div>
                </div>

                <div className="rounded-xl border border-dashed border-[#0c776b]/20 bg-[#0c776b]/5 p-3">
                  <p className="text-[15px] leading-7 text-gray-700">
                    {details.storage}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}