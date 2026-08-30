"use client"
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi';
import React, { FC, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineCamera } from 'react-icons/ai';
import Loader from '../../Loader/Loader';

type Props = {}

const EditHero: FC<Props> = () => {
    const [image, setImage] = useState("");
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");

    const { data, refetch, isLoading } = useGetHeroDataQuery("Banner", {
        refetchOnMountOrArgChange: true
    });
    const [editLayout, { isLoading: isUpdating, isSuccess, error }] = useEditLayoutMutation();

    useEffect(() => {
        if (data) {
            setTitle(data?.layout.banner.title);
            setSubTitle(data?.layout.banner.subTitle);
            setImage(data?.layout.banner.image.url);
        }
    }, [data]);

    useEffect(() => {
        if (isSuccess) {
            toast.success("Layout updated successfully!");
            refetch();
        }
        if (error) {
            if ("data" in error) {
                const errorData = error as any;
                toast.error(errorData?.data?.message);
            }
        }
    }, [isSuccess, error]);

    const handleUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: any) => {
            if (reader.readyState === 2) {
                setImage(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    const isUnchanged =
        data?.layout?.banner?.title === title &&
        data?.layout?.banner?.subTitle === subTitle &&
        data?.layout?.banner?.image?.url === image; // fixed: compare .url, not the whole object

    const handleEdit = async () => {
        if (!isUnchanged) {
            await editLayout({
                type: "Banner",
                image,
                title,
                subTitle,
            });
        }
    };

    if (isLoading) return <Loader />;

    return (
        <section className="w-full max-w-5xl mx-auto py-8 px-4">
            <div className="flex flex-col lg:flex-row items-center gap-10">

                {/* Image */}
                <div className="relative w-full max-w-xs lg:max-w-sm shrink-0">
                    <div className="relative w-full aspect-square rounded-full overflow-hidden bg-brand-100 dark:bg-brand-900">
                        {image && (
                            <img
                                src={image}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <input
                        type="file"
                        id="banner"
                        onChange={handleUpdate}
                        accept="image/*"
                        className="hidden"
                    />
                    <label
                        htmlFor="banner"
                        className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-brand-600 hover:bg-brand-700 flex items-center justify-center border-2 border-white dark:border-surface-900 cursor-pointer transition-colors"
                    >
                        <AiOutlineCamera className="w-5 h-5 text-white" />
                    </label>
                </div>

                {/* Text fields */}
                <div className="w-full flex-1 space-y-5 text-center lg:text-left">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                            Title
                        </label>
                        <textarea
                            value={title}
                            rows={3}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Hero title"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5">
                            Subtitle
                        </label>
                        <textarea
                            value={subTitle}
                            rows={3}
                            onChange={(e) => setSubTitle(e.target.value)}
                            placeholder="Hero subtitle"
                            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-surface-800 bg-white dark:bg-surface-800 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors resize-none"
                        />
                    </div>

                    <div className="flex justify-center lg:justify-start">
                        <button
                            type="button"
                            onClick={handleEdit}
                            disabled={isUnchanged || isUpdating}
                            className="px-6 py-2.5 rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
                        >
                            {isUpdating ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EditHero;