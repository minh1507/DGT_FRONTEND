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
import "./file.scss"
import { CategoryService } from "../../service/category";
import useToast from "../../hook/toast/toast";
import { FileService } from "../../service/file";

function File() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  useEffect(() => {
    findAll()
  }, []);

  const findAll = async () => {
    const file = await FileService.findAll()
    setFiles(file)
  }

  const [selectedProducts, setSelectedProducts] = useState([]);

  const actionBodyTemplate = (rowData: any) => {
    return (
      <React.Fragment>
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
    file: Yup.mixed().required("File không được để trống"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      file: '',
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
    const formData = new FormData();
    if (selectedFile) {
      formData.append('file', selectedFile); 
    }
  
    // Call your service to upload the file
    await FileService.create(formData);
    showToast("Create successfully", 'success');
    reset();
    setSelectedFile(null); // Reset the selected file
    await findAll();
  };
  

  const imageBodyTemplate = (rowData: any) => {
    return (
      <img
        src={rowData.imageURL}
        alt={rowData.originName}
        style={{ width: "150px", height: "150px", objectFit: "cover" }}
      />
    );
  };


  return (
    <section>
      <Divider />
      <Toolbar
        className="mb-3"
        left={leftToolbarTemplate}
      ></Toolbar>
      <DataTable
        value={files}
        tableStyle={{ minWidth: "50rem" }}
        selectionMode={null}
        selection={selectedProducts}
        onSelectionChange={(e: any) => setSelectedProducts(e.value)}
      >
        <Column body={imageBodyTemplate} header="Image" style={{ minWidth: "100px" }} />
        <Column field="originName" header="Tên"></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "12rem" }}
          header="Action"
        ></Column>
      </DataTable>

      <Dialog
        header="Ảnh"
        visible={visible}
        className="account-admin-page-dialog"
        onHide={() => {
          reset({
            file: '',
          })
          setSelectedFile(null); // Reset the selected file

          if (!visible) return;
          setVisible(false);
        }}
      >
        <section className="flex flex-column gap-2 mt-3">
          <label htmlFor="file">Ảnh</label>
          <InputText
            type="file" // Set type to file
            accept="image/*" // Accept image files
            className="shadow-none w-full"
            id="file"
            aria-describedby="code-help"
            onChange={(e) => {
              const file = e.target.files[0];
              setSelectedFile(file); // Set the selected file
              reset({ file: file });
            }}
          />
          {errors.file && <p className="text-danger">{errors.file.message}</p>}
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

export default File;