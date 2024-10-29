import React, { useEffect, useState } from "react";
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
import { InputTextarea } from "primereact/inputtextarea";
import { FileService } from "../../service/file";

function Product() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [files, setFiles] = useState<any[]>([])
    const [id, setId] = useState(null)

    useEffect(() => {
        findAll()
    }, []);

    const findAll = async () => {
        const products = await ProductService.findAll()
        const categories = await CategoryService.findAll()
        const files = await FileService.findAll()
        setProducts(products)
        setCategories(categories)
        setFiles(files)
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
                    onClick={() => {
                        reset({
                            title: rowData.title,
                            oldPrice: rowData.oldPrice,
                            newPrice: rowData.newPrice,
                            description: rowData.description,
                            categoryId: rowData.category?.id,
                            fileId: rowData.file?.id
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
        await ProductService.delete(id)
        await findAll()
        showToast("Delete successfully", 'success');
    };

    useTitle("category");
    const [visible, setVisible] = useState(false);

    const schema = Yup.object().shape({
        title: Yup.string().required("Tiêu đề không được để trống"),
        oldPrice: Yup.number().required("Giá cũ không được để trống").min(0),
        newPrice: Yup.number().required("Giá mới không được để trống").min(0),
        description: Yup.string().optional(),
        categoryId: Yup.number().required('Danh mục không được để trống'),
        fileId: Yup.number().required('Ảnh không được để trống'),
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
            categoryId: categories[0]?.id,
            fileId: files[0]?.id,
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
        if (id) {
            await ProductService.update(data, id)
            showToast("Update successfully", 'success');
        } else {
            await ProductService.create(data)
            showToast("Create successfully", 'success');
        }
        reset({
            title: '',
        })
        await findAll()
        setId(null)
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
                        categoryId: categories[0]?.id,
                        fileId: files[0]?.id,
                    })
                    setId(null)
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
                        rules={{ required: 'Giá cũ không được để trống', min: 0 }}
                        render={({ field }) => (
                            <InputNumber
                                placeholder="Nhập giá cũ"
                                className="shadow-none w-full"
                                id="oldPrice"
                                min={0}
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
                        rules={{ required: 'Giá mới không được để trống', min: 0 }}
                        render={({ field }) => (
                            <InputNumber
                                placeholder="Nhập giá mới"
                                className="shadow-none w-full"
                                id="newPrice"
                                min={0}
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
                        name="categoryId"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="categoryId"
                                placeholder="Chọn danh mục"
                                className="shadow-none w-full"
                                options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                            />
                        )}
                    />
                    {errors.categoryId && <p className="text-danger">{errors.categoryId.message}</p>}
                </section>

               {!id &&  <section className="flex flex-column gap-2 mt-3">
                    <label htmlFor="fileId">Ảnh</label>
                    <Controller
                        name="fileId"
                        control={control}
                        render={({ field }) => (
                            <Dropdown
                                id="fileId"
                                placeholder="Chọn ảnh"
                                className="shadow-none w-full"
                                options={files.map((file) => ({
                                    label: file.originName,
                                    value: file.id,
                                    imageURL: file.imageURL, 
                                }))}
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
                                itemTemplate={(option) => (
                                    <div className="flex align-items-center">
                                        <img
                                            src={option.imageURL}
                                            alt={option.label}
                                            style={{ width: "30px", height: "30px", objectFit: "cover", marginRight: "8px" }}
                                        />
                                        <span>{option.label}</span>
                                    </div>
                                )}
                            />
                        )}
                    />
                    {errors.fileId && <p className="text-danger">{errors.fileId.message}</p>}
                </section>}


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