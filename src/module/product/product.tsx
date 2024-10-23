import React, { useEffect, useRef, useState } from "react";
import { DataTable } from "primereact/datatable";
import { useTitle } from "../../hook/title/title";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../yupConfig";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { CategoryService } from "../../service/category";
import useToast from "../../hook/toast/toast";
import { ProductService } from "../../service/product";
import './product.scss'
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { ICategory } from "../category/type/category";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";

function Product() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [id, setId] = useState(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileUploadRef = useRef<any>(null);

    useEffect(() => {
        findAll()
    }, []);

    const findAll = async () => {
        const products = await ProductService.findAll()
        const categories = await CategoryService.findAll()
        setProducts(products)
        setCategories(categories)
    }

    const [selectedProducts, setSelectedProducts] = useState([]);

    const actionBodyTemplate = (rowData: any) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2 shadow-none"
                    onClick={async () => {
                        reset({
                            title: rowData.title,
                        })
                        setVisible(true)
                        setId(rowData.id)
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    className="shadow-none"
                    onClick={() => deleteProd(rowData.id)}
                />
            </React.Fragment>
        );
    };

    const deleteProd = async (id: number) => {
        await CategoryService.delete(id)
        await findAll()
        showToast("Delete successfully", 'success');
    };

    useTitle("category");
    const [visible, setVisible] = useState(false);

    const schema = Yup.object().shape({
        title: Yup.string().required("Tiêu đề không được để trống"),
        oldPrice: Yup.number().required("Giá cũ không được để trống").min(0).max(1000),
        newPrice: Yup.number().required("Giá mới không được để trống").min(0).max(1000),
        description: Yup.string().optional(),
        category: Yup.number().required('Danh mục không được để trống'),
        image: Yup.mixed().required('Hình ảnh là bắt buộc').nullable(),
    });

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            title: '',
            oldPrice: 1,
            newPrice: 1,
            description: '',
            category: categories[0]?.id,
            image: null,
        },
    });

    const leftToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    label="Thêm mới"
                    icon="pi pi-plus"
                    severity="success"
                    className="shadow-none"
                    onClick={() => setVisible(true)}
                />
            </div>
        );
    };

    const { showToast } = useToast();

    const onSubmit = async (data: any) => {
        console.log(data)
        // if (id) {
        //     await CategoryService.update(data, id)
        //     showToast("Update successfully", 'success');
        // } else {
        //     await CategoryService.create(data)
        //     showToast("Create successfully", 'success');
        // }
        // reset({
        //     title: '',
        // })
        // await findAll()
        // setId(null)
    };

    const handleFileChange = (e: any) => {
        const file = e.files[0]; // Access the first file from the FileUpload component
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set the image preview state
            };
            reader.readAsDataURL(file); // Read the file for preview
            setValue('image', file); // Set the image file in the form state
        }
    };

    return (
        <section>
            <Toolbar
                className="mb-3"
                left={leftToolbarTemplate}
            ></Toolbar>
            <DataTable
                value={products}
                tableStyle={{ minWidth: "50rem" }}
                selectionMode={null}
                selection={selectedProducts}
                onSelectionChange={(e: any) => setSelectedProducts(e.value)}
            >
                <Column field="title" header="Tiêu đề"></Column>
                <Column field="oldPrice" header="Giá cũ"></Column>
                <Column field="newPrice" header="Giá Mới"></Column>
                <Column field="description" header="Mô tả"></Column>
                <Column
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ minWidth: "12rem" }}
                    header="Action"
                ></Column>
            </DataTable>

            <Dialog
                header="Danh mục"
                visible={visible}
                className="account-admin-page-dialog"
                onHide={() => {
                    reset({
                        title: '',
                        oldPrice: 1,
                        newPrice: 1,
                        description: '',
                        category: categories[0]?.id,
                        image: null,
                    })
                    setId(null)
                    setImagePreview(null);
                    if (!visible) return;
                    setVisible(false);
                }}
            >
                <section className="flex flex-column gap-2 mt-3">
                    <label htmlFor="title">Tiêu đề</label>
                    <InputText
                        placeholder="Nhập tiêu đề"
                        className="shadow-none w-full"
                        id="title"
                        aria-describedby="name-help"
                        {...register("title")}
                    />
                    {errors.title && <p className="text-danger">{errors.title.message}</p>}
                </section>

                <section className="flex flex-column gap-2 mt-3">
                    <label htmlFor="oldPrice">Giá cũ</label>
                    <Controller
                        name="oldPrice"
                        control={control}
                        rules={{ required: 'Giá cũ không được để trống', min: 0, max: 1000 }}
                        render={({ field }) => (
                            <InputNumber
                                placeholder="Nhập giá cũ"
                                className="shadow-none w-full"
                                id="oldPrice"
                                min={0}
                                max={1000}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                            />
                        )}
                    />
                    {errors.oldPrice && <p className="text-danger">{errors.oldPrice.message}</p>}
                </section>

                <section className="flex flex-column gap-2 mt-3">
                    <label htmlFor="newPrice">Giá mới</label>
                    <Controller
                        name="newPrice"
                        control={control}
                        rules={{ required: 'Giá mới không được để trống', min: 0, max: 1000 }}
                        render={({ field }) => (
                            <InputNumber
                                placeholder="Nhập giá mới"
                                className="shadow-none w-full"
                                id="newPrice"
                                min={0}
                                max={1000}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                            />
                        )}
                    />
                    {errors.newPrice && <p className="text-danger">{errors.newPrice.message}</p>}
                </section>

                <section className="flex flex-column gap-2 mt-3">
                    <label htmlFor="category">Danh mục</label>
                    <Controller
                        name="category"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="category"
                                placeholder="Chọn danh mục"
                                className="shadow-none w-full"
                                options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                            />
                        )}
                    />
                    {errors.category && <p className="text-danger">{errors.category.message}</p>}
                </section>

                <section className="flex flex-column gap-2 mt-3">
                    <label htmlFor="description">Mô tả</label>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => (
                            <InputTextarea
                                placeholder="Nhập mô tả"
                                className="shadow-none w-full"
                                id="description"
                                rows={5}
                                {...field}
                            />
                        )}
                    />
                    {errors.description && <p className="text-danger">{errors.description.message}</p>}
                </section>

                <section className="flex flex-column gap-2 mt-3">
                    <label htmlFor="image">Chọn hình ảnh</label>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <FileUpload
                                ref={fileUploadRef}
                                mode="basic"
                                accept="image/*"
                                maxFileSize={15000000}
                                onSelect={(e) => {
                                    field.onChange(e.files[0]);
                                    handleFileChange(e)
                                }} 
                                onError={(e) => console.log('Upload failed:', e)}
                                onClear={() => {
                                    field.onChange(null);
                                    setImagePreview(null); 
                                    fileUploadRef.current.clear();
                                }}
                                multiple={false}
                            />
                        )}
                    />
                    {errors.image && <p className="text-danger">{errors.image.message}</p>}
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="mt-2 w-24 h-24 object-cover"
                        />
                    )}
                </section>

                <div className="flex justify-content-end">
                    <Button
                        onClick={handleSubmit(async (data) => {
                            await onSubmit(data)
                            if (!visible) return;
                            setVisible(false);
                        })}
                        className="shadow-none mt-4"
                        label="Submit"
                    />
                </div>
            </Dialog>
        </section>
    );
}

export default Product;