import {
  Button,
  DatePicker,
  Dropdown,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Table,
} from "antd";
import React, { useEffect, useState } from "react";
import { API } from "../config/auth";
import TextField from "../components/TextField";
import DateInput from "../components/DateInput";
import { MoreOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Task = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const userId = window.localStorage.getItem("userId");
  const columns = [
    {
      title: "No",
      width: 70,
      dataIndex: "ID",
      key: "ID",
    },
    {
      title: "Name",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: "Due date",
      dataIndex: "due_date",
      key: "due_date",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "description",
      key: "description",
      render: (_, data) => {
        return (
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  label: (
                    <p
                      onClick={() => {
                        setModelData({
                          open: true,
                          name: data?.task_name,
                          due_date: dayjs(data?.due_date).isValid()
                            ? dayjs(data?.due_date)
                            : "",
                          due_date_string: "",
                          description: data?.description,
                          action: "update",
                          task_id: data?.task_id,
                        });
                      }}
                    >
                      Edit
                    </p>
                  ),
                },
                {
                  label: (
                    <Popconfirm
                      title="Are you sure to delete this task?"
                      onConfirm={() => deleteTask(data?.task_id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <p>Delete</p>
                    </Popconfirm>
                  ),
                },
              ],
            }}
          >
            <MoreOutlined style={{ cursor: "pointer" }} />
          </Dropdown>
        );
      },
      width: 100,
    },
  ];

  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modelData, setModelData] = useState({
    open: false,
    name: "",
    due_date: "",
    due_date_string: "",
    description: "",
    action: "",
    task_id: "",
  });
  const [renderState, setRenderState] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const getAllTasks = async (page = 1) => {
    setLoading(true);

    await API.get(
      `/task/get_all_tasks?user_id=${userId}&page=${page}&per_page=5`
    )
      .then((response) => {
        if (response.data?.success) {
          let tasks = response?.data?.data?.tasks.map((item, i) => {
            return {
              ...item,
              ID: (page - 1) * 5 + (i + 1),
            };
          });
          setData(tasks);
          setTotal(response?.data?.data?.total);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddTask = async () => {
    if (!modelData?.due_date || !modelData?.name) {
      return messageApi.error("Some fields are missing!!");
    }

    setBtnLoading(true);

    if (modelData?.action === "create") {
      await API.post(`/task/create_task`, {
        user_id: userId,
        task_name: modelData?.name,
        due_date: modelData?.due_date,
        description: modelData?.description,
      })
        .then((response) => {
          if (response?.data?.success) {
            messageApi.success("Task created successfully!!");

            setModelData({
              open: false,
              name: "",
              due_date: "",
              description: "",
              due_date_string: "",
              action: "",
            });
          } else {
            return messageApi.error("Error occured!!");
          }
        })
        .finally(() => {
          setBtnLoading(false);
        });
    } else if (modelData?.action === "update") {
      await API.patch(`/task/update_task`, {
        user_id: userId,
        task_name: modelData?.name,
        due_date: modelData?.due_date,
        description: modelData?.description,
        task_id: modelData?.task_id,
      })
        .then((response) => {
          if (response?.data?.success) {
            messageApi.success("Task updated successfully!!");

            setModelData({
              open: false,
              name: "",
              due_date: "",
              description: "",
              due_date_string: "",
              action: "",
            });
          } else {
            return messageApi.error("Error occured!!");
          }
        })
        .finally(() => {
          setBtnLoading(false);
        });
    }

    setRenderState(!renderState);
  };

  const deleteTask = async (task_id) => {
    console.log(task_id);

    await API.delete(`/task/delete_task`, { data: { task_id } }).then(
      (response) => {
        console.log(response.data);
        if (response.data?.success) {
          setPage(1);
          setRenderState((prev) => !prev);
          messageApi.success("Task deleted successfully!!");
        }
      }
    );
  };

  console.log(modelData);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setModelData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    getAllTasks(page);
  }, [renderState]);

  const logout = async () => {
    window.localStorage.clear();
    navigate("/");
  };

  return (
    <div className="task_cont">
      {contextHolder}

      <Modal
        open={modelData?.open}
        title={modelData?.action === "create" ? "Create Task" : "Update Task"}
        footer={false}
        onCancel={() => {
          setModelData({
            open: false,
            name: "",
            due_date: "",
            description: "",
            due_date_string: "",
            action: "",
          });
        }}
        centered
      >
        <Flex vertical gap={16}>
          <TextField
            placeholder="Enter Task Name"
            name="name"
            value={modelData?.name}
            onChange={handleChange}
          />
          <TextField
            placeholder="Description"
            name="description"
            value={modelData?.description}
            onChange={handleChange}
          />
          <DateInput
            placeholder="Due date"
            name="due_date"
            value={modelData?.due_date}
            onChange={(value, string) => {
              setModelData((prev) => ({
                ...prev,
                due_date: value,
                due_date_string: string,
              }));
            }}
          />
          <Flex justify="center" gap={16}>
            <Button type="primary" onClick={handleAddTask} loading={btnLoading}>
              Save
            </Button>
            <Button
              onClick={() => {
                setModelData({
                  open: false,
                  name: "",
                  due_date: "",
                  description: "",
                  action: "",
                  due_date_string: "",
                });
              }}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </Modal>

      <h2>Task Management</h2>
      <br />

      <Flex justify="end">
        <Button
          onClick={() => {
            setModelData((prev) => ({
              ...prev,
              open: true,
              action: "create",
            }));
          }}
          type="primary"
        >
          Add Task
        </Button>
      </Flex>

      <Table
        className="task_table"
        columns={columns}
        dataSource={data}
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          onChange: (page) => {
            getAllTasks(page);
            setPage(page);
          },
          total: total,
          pageSize: 5,
          position: ["bottomCenter"],
        }}
        rowKey={(record) => record?.task_id}
      />

      <div className="logout">
        <Button size="small" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Task;
