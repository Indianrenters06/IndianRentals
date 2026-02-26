<CardBody className="p-8 space-y-12">

    {/* Basic Information */}
    <div className="space-y-6">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FiTag className="text-indigo-500" /> Basic Information
            </h3>
            <Divider className="bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Product Name <span className="text-rose-500">*</span>
                </label>
                <Input
                    isRequired
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product title"
                    variant="bordered"
                    classNames={{
                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                />
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Brand Name
                </label>
                <Input
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g. Sony, Nikon"
                    variant="bordered"
                    classNames={{
                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Product Description <span className="text-rose-500">*</span>
            </label>
            <Textarea
                isRequired
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe features, colors, condition etc."
                variant="bordered"
                minRows={4}
                classNames={{
                    inputWrapper: "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                }}
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Primary Category <span className="text-rose-500">*</span>
                </label>
                <Select
                    isRequired
                    placeholder="Select a category"
                    variant="bordered"
                    selectedKeys={formData.category ? [formData.category] : []}
                    onSelectionChange={(keys) => handleSelectChange('category', Array.from(keys)[0])}
                    classNames={{
                        trigger: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                >
                    {categories.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Sub-Category (Optional)
                </label>
                <Select
                    placeholder="Choose sub-cat"
                    variant="bordered"
                    isDisabled={subcategories.length === 0}
                    selectedKeys={formData.subcategory ? [formData.subcategory] : []}
                    onSelectionChange={(keys) => handleSelectChange('subcategory', Array.from(keys)[0])}
                    classNames={{
                        trigger: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                >
                    {subcategories.map((subcat) => (
                        <SelectItem key={subcat._id} value={subcat._id}>
                            {subcat.name}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        </div>
    </div>

    {/* Pricing & Inventory */}
    <div className="space-y-6">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FiDollarSign className="text-emerald-500" /> Pricing & Inventory
            </h3>
            <Divider className="bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Daily Rent (₹) <span className="text-rose-500">*</span>
                </label>
                <Input
                    isRequired
                    type="number"
                    name="rentalPrice"
                    value={formData.rentalPrice}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    variant="bordered"
                    startContent={<span className="text-indigo-500 font-bold text-sm">₹</span>}
                    classNames={{
                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Security Deposit (₹) <span className="text-rose-500">*</span>
                </label>
                <Input
                    isRequired
                    type="number"
                    name="securityDeposit"
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    variant="bordered"
                    startContent={<span className="text-indigo-500 font-bold text-sm">₹</span>}
                    classNames={{
                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Stock Quantity <span className="text-rose-500">*</span>
                </label>
                <Input
                    isRequired
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="1"
                    variant="bordered"
                    startContent={<FiBox className="text-indigo-500 text-sm" />}
                    classNames={{
                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Item Condition <span className="text-rose-500">*</span>
                </label>
                <Select
                    isRequired
                    variant="bordered"
                    placeholder="Condition"
                    selectedKeys={[formData.condition]}
                    onSelectionChange={(keys) => handleSelectChange('condition', Array.from(keys)[0])}
                    classNames={{
                        trigger: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                >
                    <SelectItem key="New" value="New">New</SelectItem>
                    <SelectItem key="Good" value="Good">Good</SelectItem>
                    <SelectItem key="Fair" value="Fair">Fair</SelectItem>
                </Select>
            </div>
        </div>
    </div>

    {/* Location & Media */}
    <div className="space-y-6">
        <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <FiMapPin className="text-rose-500" /> Location & Media
            </h3>
            <Divider className="bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    Pickup City <span className="text-rose-500">*</span>
                </label>
                <Input
                    isRequired
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangalore"
                    variant="bordered"
                    classNames={{
                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    State <span className="text-rose-500">*</span>
                </label>
                <Input
                    isRequired
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="e.g. Karnataka"
                    variant="bordered"
                    classNames={{
                        inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                    }}
                />
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                Product Images (Cloudinary URL)
            </label>
            <Input
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://res.cloudinary.com/..."
                variant="bordered"
                startContent={<FiImage className="text-indigo-500 text-sm" />}
                classNames={{
                    inputWrapper: "h-12 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 transition-all shadow-sm focus-within:ring-2 focus-within:ring-indigo-500/20"
                }}
            />

            {formData.image && (
                <div className="mt-4 p-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-sm overflow-hidden bg-slate-50 dark:bg-slate-900/40">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-3 tracking-widest text-center">Visual Preview</p>
                    <div className="h-48 flex items-center justify-center bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-inner border border-slate-100 dark:border-slate-800/50">
                        <img src={formData.image} alt="Preview" className="max-w-full max-h-full object-contain p-2" />
                    </div>
                </div>
            )}
        </div>
    </div>

    <div className="flex justify-end pt-8">
        <Button
            type="submit"
            color="primary"
            size="lg"
            isLoading={loading}
            startContent={!loading && <FiSave />}
            className="font-medium px-10 shadow-lg shadow-indigo-500/30"
        >
            Publish Product
        </Button>
    </div>
</CardBody>
