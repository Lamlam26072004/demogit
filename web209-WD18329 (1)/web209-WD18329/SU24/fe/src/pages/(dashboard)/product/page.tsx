import instance from "@/configs/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm, Table } from "antd";

const ProductPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["products"],
        queryFn: () => instance.get("/products"),
    });
    const mutation = useMutation({
        mutationFn: async (id) => {
            try {
                return await instance.delete(`/products/${id}`);
            } catch (error) {
                throw error;
            }
        },
        onSuccess: () => {
            messageApi.open({
                type: "success",
                content: "Xóa sản phẩm thành công",
            });
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
        },
        onError: (error) => {
            messageApi.open({
                type: "error",
                content: error.message,
            });
        },
    });
    const dataSource = data?.data.map((item: any) => ({
        key : item.key,
        ...item, 
    })) 
    const columns =[
        {
            title : " Tên sản phâm " ,
            dataIndex : "name",
            key : "name"
        },
        {
            title : "Giá sản phẩm " ,
            dataIndex : "price",
            key : "price"
        },
        {
            title : "Mổ tả  sản phẩm " ,
            dataIndex : "description",
            key : "description"
        }, 
        {
            dataIndex: "action",
            render: (_: any, product: any) => (
                <Popconfirm
                    title="Xóa sản phẩm"
                    description="Bạn có chắc muốn xóa sản phẩm này không?"
                    onConfirm={() => mutation.mutate(product.id)}
                    // onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button type="primary" className="" danger>
                        Xóa
                    </Button>
                </Popconfirm>
            ),
        },
    ];
    // if (isLoading || isFetching) return <div>Loading...</div>;
    // if (isError) return <div>Error: {error.message}</div>;
    // if (mutation?.isError) return <div>Error: {mutation.error.message}</div>;
    return (
        <div>
            {contextHolder}

                        <Table dataSource={dataSource} columns={columns} />;

        </div>
    );
}

export default ProductPage;
