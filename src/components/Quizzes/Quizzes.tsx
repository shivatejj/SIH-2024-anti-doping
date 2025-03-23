import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import styles from "./Quizzes.module.css";
import { Button, Col, Row, Spin, Table, Tooltip } from "antd";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { useRouter } from "next/router";

interface IQuizzesResponse {
  success: boolean;
  data: {
    id: string;
    category: string;
    level: string;
  }[];
  pagination: {
    pageIndex: number;
    pageSize: number;
    total: number;
  };
}

const Quizzes: FC = () => {

  const { data: session } = useSession();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<IQuizzesResponse>({
    success: false,
    data: [],
    pagination: {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/quiz/getAll?page=${pageIndex}&limit=${pageSize}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.user?.accessToken}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((json) => setQuizzes(json))
      .catch((error) => {
        console.error("Error fetching quizzes:", error);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.accessToken, pageIndex, pageSize]);

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(
        `/api/quiz/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session?.user?.accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )

      if (response.ok) {
        setQuizzes((prevState) => ({
          success: true,
          data: prevState.data.filter((quiz) => quiz.id !== id),
          pagination: { ...prevState.pagination, total: prevState.pagination.total - 1 },
        }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onChangePageIndex = (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const onPageSizeChange = (currentPage: number, pageSize: number) => {
    setPageSize(pageSize);
  };

  return (
    <div className={styles.container}>
      <Spin spinning={loading} fullscreen />
      <Row justify={'space-between'}>
        <Col span={12}>
          <h1 className={styles.title}>Quizzes</h1>
        </Col>
        <Col span={12} className={styles.addQuiz}>
          <Button
            type="primary"
            onClick={() => router.push("/add-quiz")}
          >
            Add Quiz
          </Button>
        </Col>
      </Row>
      <div className={styles.tableContainer}>
        <Table
          rowKey="_id"
          className={styles.table}
          dataSource={quizzes?.data}
          bordered
          columns={[
            {
              title: "Category",
              dataIndex: "category",
              key: "category",
              width: 100,
              render: (category) => (
                <span>
                  {capitalizeFirstLetter(category)}
                </span>
              )
            },
            {
              title: "Level",
              dataIndex: "level",
              key: "level",
              width: 100,
              render: (level) => (
                <span>
                  {capitalizeFirstLetter(level)}
                </span>
              )
            },
            {
              title: "Actions",
              key: "actions",
              width: 100,
              render: (record) => (
                <>
                  <Tooltip title="Functionality yet to be implemented">
                    <Button
                      type="link"
                      onClick={() => console.log(record.id)}
                      disabled
                    >
                      View
                    </Button>
                  </Tooltip>
                  <Button
                    type="link"
                    onClick={() => deleteRecord(record.id)}
                  >
                    Delete
                  </Button>
                </>
              )
            }
          ]}
          pagination={{
            showSizeChanger: true,
            defaultCurrent: 1,
            defaultPageSize: 10,
            pageSize: pageSize,
            current: pageIndex,
            pageSizeOptions: [10, 20, 50, 100],
            total: quizzes?.pagination?.total,
            onChange: onChangePageIndex,
            onShowSizeChange: onPageSizeChange,
          }}
        />
      </div>
    </div>
  )
}

export default Quizzes;