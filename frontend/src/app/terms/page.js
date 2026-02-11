'use client';

import React from 'react';
import Image from 'next/image';

const policies = [
    {
        title: "Return Policy",
        content: [
            {
                subtitle: "Lorem Ipsum",
                text: "Lorem ipsum dolor sit amet consectetur. Feugiat odio facilisis imperdiet morbi. Aliquet felis non adipiscing leo dui. Lobortis ornare amet sem elementum praesent. Turpis ultricies ac ut faucibus urna ipsum curabitur in quam. Dui tincidunt et urna nibh porta sit ut velit tincidunt. Eget in purus odio ut tellus id tellus nec nunc. Proin bibendum iaculis tincidunt pretium magna in pretium. Ultricies ut eget magna aliquam curabitur fames tempor aliquam. Aliquam at ornare in volutpat est id id leo aliquam. Sed orci neque sit quis a amet ullamcorper. Id nullam viverra duis nibh. Duis eget vulputate nisl imperdiet cras posuere laoreet. Feugiat integer duis lacus adipiscing."
            },
            {
                text: "Posuere volutpat urna pretium sed ac ut ultricies elementum euismod. A porttitor fermentum pulvinar etiam mi faucibus eget fusce est. Turpis laoreet viverra malesuada hendrerit sit. Velit bibendum id tincidunt quis augue. Vel interdum massa pellentesque nunc aliquet enim tempus. Turpis diam porttitor aliquam hac sit. Facilisi facilisi pellentesque nisl ac urna tempus augue. Sapien donec laoreet volutpat sit aliquet in id. Blandit enim porttitor amet nullam faucibus volutpat enim donec. Elementum ipsum egestas mollis aliquam mi hendrerit ridiculus a. Purus a fermentum neque adipiscing dui id dui in velit."
            },
            {
                text: "Rhoncus sem mauris feugiat ullamcorper. Accumsan non volutpat adipiscing eleifend quisque tincidunt tempus in at. Lorem diam et purus blandit. Dolor commodo diam eget tellus in viverra."
            },
            {
                text: "Ornare lectus facilisis at viverra malesuada nibh ut eget. Ullamcorper ut quam leo nunc. Tempor volutpat arcu senectus in nisi cras habitasse aliquam. In vitae at enim interdum ut. Tincidunt eu quam massa est turpis pellentesque. Eu lorem scelerisque elementum ipsum morbi porttitor."
            },
            {
                text: "Mattis donec a nulla urna. Mattis amet neque sit vulputate eu duis elementum vitae pulvinar. Quam lobortis vehicula netus vulputate eget massa ultrices. Consequat turpis rutrum in a. Ullamcorper adipiscing sed dui mattis etiam pharetra. Consectetur imperdiet viverra sed lorem nunc tellus integer malesuada adipiscing."
            },
            {
                text: "Quam quis morbi sed convallis quisque a massa morbi. Curabitur nulla cursus ut ante elementum convallis. Enim eu arcu odio sit turpis. Nunc arcu euismod gravida at mi quis. Euismod nec eleifend ultrices a malesuada rhoncus eu et euismod. Tellus sodales sagittis tellus nam ullamcorper lobortis nisl enim ullamcorper. Sed ornare id a ut nulla. Tempor ultricies senectus massa vel arcu adipiscing elementum. Pretium blandit convallis turpis id. Massa ultrices massa proin aliquam enim purus. Nibh aliquam volutpat at amet non cras mattis. Ultrices duis senectus interdum scelerisque neque."
            },
            {
                text: "Arcu tortor venenatis id fusce. Mi lacus bibendum pharetra tortor velit proin elit nunc. Nisl rutrum sollicitudin est bibendum. Lobortis egestas lorem adipiscing sit ornare pellentesque sed at adipiscing. Non cursus vivamus id bibendum et turpis vitae. Leo enim aliquam urna tempus egestas nunc id vel. Non."
            }
        ]
    }
];

export default function TermsPage() {
    return (
        <div className="font-sans text-gray-800 pb-20">
            {/* Banner Section */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
                <div className="w-full h-[300px] md:h-[400px] relative bg-gray-200 overflow-hidden rounded-3xl group">
                    <Image
                        src="https://res.cloudinary.com/dpu9ikeqe/image/upload/v1770802400/ae1488b221c19db77a3c781e4313273ed5449f17_xdpggg.jpg"
                        alt="Terms & Conditions Banner"
                        fill
                        className="object-cover object-center brightness-75 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <h1 className="text-white text-5xl md:text-7xl font-semibold drop-shadow-lg font-manrope text-center px-4">Terms & Conditions</h1>
                    </div>
                </div>
            </div>

            {/* Content Policies */}
            <div className="max-w-[1150px] mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
                {policies.map((section, index) => (
                    <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 border-b border-gray-100 last:border-0 pb-16 last:pb-0">
                        {/* Title Column */}
                        <div className="lg:col-span-4">
                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 font-manrope sticky top-32 leading-tight">
                                {section.title}
                            </h2>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-8 space-y-8">
                            {section.content.map((item, idx) => (
                                <div key={idx} className="font-manrope text-gray-600 leading-relaxed text-base md:text-lg">
                                    {item.subtitle && (
                                        <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                                            {item.subtitle}
                                        </h3>
                                    )}
                                    <p className="leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
