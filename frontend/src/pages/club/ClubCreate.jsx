import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { MuiFileInput } from "mui-file-input";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import HomeSearchClub from "./main/HomeSearchClub";
import CategoryModal from "./meeting/CategoryModal";
import CategoryModalSub from "./meeting/CategoryModalSub";

const ClubCreate = () => {
  //큰 카테고리관련 코드
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleOpenModal = () => setOpenCategoryModal(true);
  const handleCloseModal = () => setOpenCategoryModal(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // 선택된 카테고리 저장
    handleCloseModal(); // 모달 닫기
    handleOpenSubModal();
  };
  //큰 카테고리관련 코드.END

  //작은 카테고리설정 코드
  const [openSubCategoryModal, setOpenSubCategoryModal] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const handleOpenSubModal = () => setOpenSubCategoryModal(true);
  const handleCloseSubModal = () => setOpenSubCategoryModal(false);

  const handleSubCategorySelect = (subCategory) => {
    setSelectedSubCategory(subCategory); // 선택된 카테고리 저장
    handleCloseSubModal(); // 모달 닫기
  };

  useEffect(() => {
    setSelectedSubCategory("");
  }, [selectedCategory]);
  //작은 카테고리설정 코드.end

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    defaultValues: {
      mainCategory: "",
      subCategory: "",
      maxMember: 10,
      title: "",
      subTitle: "",
      content: "",
    },
    mode: "onChange",
  });

  //사진 파일 관련 코드
  const [locationImg, setLocationImg] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    console.log("File change event triggered"); // 이벤트 발생 확인
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file); // 파일 선택 확인

      setValue("img", file); // react-hook-form에 파일 설정
      setLocationImg(file);
      console.log(locationImg);
      // 미리보기 설정
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        console.log("Preview URL set:", reader.result); // 미리보기 URL 설정 확인
      };
      reader.readAsDataURL(file);
    }
  };
  //사진 파일 관련 코드.end

  // 주소 선택 시 업데이트
  const [homeLocation, setHomeLocation] = useState({
    sido: "",
    sigoon: "",
    dong: "",
  });

  // HomeSearchClub에서 선택된 주소를 useForm의 필드에 반영
  useEffect(() => {
    setValue("region.city", homeLocation.sido);
    setValue("region.district", homeLocation.sigoon);
    setValue("region.neighborhood", homeLocation.dong);
  }, [homeLocation, setValue]);

  const onSubmit = (data) => {
    console.log(data);

    axiosInstance
      .post("/clubs/create", data)
      .then((response) => {
        console.log(response.data);
        alert("모임 만들기에 성공했습니다");
        navigate("/clublist");
      })
      .catch((err) => {
        console.error(err);
        alert("모임 만들기에 실패했습니다");
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontWeight: "600",
          padding: "10px",
          marginTop: "10px",
        }}
      >
        모임개설
      </Typography>
      <Container maxWidth="md" sx={{ marginTop: "20px" }}>
        <Grid container spacing={1} sx={{ alignItems: "center" }}>
          <Grid item xs={3} sx={{ padding: "0px" }}>
            <Typography sx={{ fontWeight: "600", padding: "0px" }}>
              지역
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <HomeSearchClub
              setSelectedSido={(sido) =>
                setHomeLocation((prev) => ({ ...prev, sido }))
              }
              setSelectedSigoon={(sigoon) =>
                setHomeLocation((prev) => ({ ...prev, sigoon }))
              }
              setSelectedDong={(dong) =>
                setHomeLocation((prev) => ({ ...prev, dong }))
              }
            />
          </Grid>
          {/* 나머지 폼 필드 */}
          <Grid item xs={3} sx={{ padding: "0px" }}>
            <Typography sx={{ fontWeight: "600", padding: "0px" }}>
              큰 관심사
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              id="mainCategory"
              label="ex ) 큰 관심사 : 운동,여행,사교 등등"
              placeholder="눌럿을 때 모달띄워서 큰관심 선택 후 작은관심선택 후 자동기입까지"
              sx={{ width: "100%", mb: 2 }}
              onClick={handleOpenModal}
              value={selectedCategory}
              {...register("mainCategory", { required: " 필수입력 요소." })}
            />
          </Grid>
          <Grid item xs={3} sx={{ padding: "0px" }}>
            <Typography sx={{ fontWeight: "600", padding: "0px" }}>
              상세 관심사
            </Typography>
          </Grid>
          <Grid item xs={9}>
            <TextField
              id="subCategory"
              label="상세관심사 : 자전거/야구/서핑/웨이크보드/요트 등등(최대3개)"
              sx={{ width: "100%", mb: 2 }}
              onClick={handleOpenModal}
              value={selectedSubCategory}
              {...register("subCategory", { required: " 필수입력 요소." })}
            />
          </Grid>
          {/* 파일 입력 및 미리보기 */}
          <Grid item xs={12}>
            <input
              id="img"
              type="file"
              accept="image/png, image/gif, image/jpeg"
              onChange={handleFileChange}
              style={{display : 'none'}}
            />
            <label htmlFor="img">
              <Button
                variant="outlined"
                component="span"
                sx={{ width: "100%" }}
              >
                여기를 클릭해 모임 대표사진을 설정해보세요
              </Button>
            </label>
            {preview && (
              <Box mt={2} sx={{ width: "100%", height: "230px" }}>
                <img
                  src={preview}
                  alt="미리보기"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            )}
          </Grid>

          <Grid item xs={12}>
            <TextField
              id="title"
              label="모임 이름"
              sx={{ width: "100%", mb: 2 }}
              {...register("title", { required: " 필수입력 요소." })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="subTitle"
              label="모임에 대한 간략한 설명을 넣어보세요"
              sx={{ width: "100%", mb: 2 }}
              {...register("subTitle", { required: " 필수입력 요소." })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="content"
              label="내용 입력"
              multiline
              rows={10} // 텍스트 영역의 기본 행 수
              variant="outlined" // 텍스트 필드의 스타일 (outlined, filled, standard)
              sx={{ width: "100%", mb: 2 }} // 스타일 설정 (예: 너비, 마진)
              {...register("content", { required: " 필수입력 요소." })}
            />
          </Grid>
          <Grid item xs={2}>
            <Typography sx={{ fontWeight: "600" }}>정원 (10~300명)</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              id="maxMember"
              label="숫자만 입력"
              inputProps={{ type: "number", min: 10, max: 300 }}
              sx={{ width: "100%" }}
              {...register("maxMember", { required: " 필수입력 요소." })}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "20px" }}>
            <Button variant="outlined" sx={{ width: "100%" }} type="submit">
              모임 만들기
            </Button>
          </Grid>
        </Grid>
        <CategoryModal
          open={openCategoryModal}
          onClose={handleCloseModal}
          onCategorySelect={handleCategorySelect}
        />
        <CategoryModalSub
          open={openSubCategoryModal}
          onClose={handleCloseSubModal}
          onSubCategorySelect={handleSubCategorySelect}
          mainCategory={selectedCategory}
        />
      </Container>
    </Box>
  );
};

export default ClubCreate;
