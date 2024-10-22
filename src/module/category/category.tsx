import { DataTable } from "primereact/datatable";
import { useTitle } from "../../hook/title/title";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Yup from "../../yupConfig";
import { Divider } from "primereact/divider";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import "./category.scss"
import { CategoryService } from "../../service/category";
import { ICategory } from "./type/category";
import useToast from "../../hook/toast/toast";

function Category() {
  const [categories, setCategories] = useState([]);
  const [id, setId] = useState(null)

  useEffect(() => {
    findAll()
  }, []);

  const findAll = async () => {
    const categories = await CategoryService.findAll()
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
              name: rowData.name,
              code: rowData.code
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
    name: Yup.string().required("Tên không được để trống"),
    code: Yup.string().required("Mã không được để trống"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      code: '',
    },
  });

  const onSearch = async (data: ICategory) => {
    await findAll();
  };

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
      await CategoryService.update(data, id)
      showToast("Update successfully", 'success');
    } else {
      await CategoryService.create(data)
      showToast("Create successfully", 'success');
    }
    reset({
      name: '',
      code: ''
    })
    await findAll()
    setId(null)
  };


  return (
    <section >
      <form className="mt-3" onSubmit={handleSubmit(onSearch)}>
        <section>
          <InputText className="shadow-none" placeholder={"Nhập tên"} />
        </section>
        <section>
          <Button type="submit" className="mt-3 shadow-none" label="Tìm kiếm" />
        </section>
      </form>
      <Divider />
      <Toolbar
        className="mb-3"
        left={leftToolbarTemplate}
      ></Toolbar>
      <DataTable
        value={categories}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode={null}
        selection={selectedProducts}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
      >
        <Column field="name" header="Tên"></Column>
        <Column field="code" header="Mã"></Column>
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
            name: '',
            code: ''
          })
          setId(null)
          if (!visible) return;
          setVisible(false);
        }}
      >
        <section className="flex flex-column gap-2 mt-3">
          <label htmlFor="name">Tên</label>
          <InputText
            placeholder="Nhập tên"
            className="shadow-none w-full"
            id="name"
            aria-describedby="name-help"
            {...register("name")}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
        </section>

        <section className="flex flex-column gap-2 mt-3">
          <label htmlFor="code">Mã</label>
          <InputText
            placeholder="Nhập mã"
            className="shadow-none w-full"
            id="code"
            aria-describedby="name-help"
            {...register("code")}
          />
          {errors.name && <p className="text-danger">{errors.name.message}</p>}
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

export default Category;