import React, { useRef, useState, useEffect, useCallback } from 'react'; // React와 여러 훅을 임포트
import ImageEditor from '@toast-ui/react-image-editor'; // TOAST UI Image Editor 컴포넌트를 임포트
import 'tui-image-editor/dist/tui-image-editor.css'; // TOAST UI Image Editor의 CSS 파일을 임포트
import { Button, Box, Grid } from '@mui/material'; // MUI 컴포넌트(Button, Box, Grid)를 임포트
import FloatingLabelInput from '../../../components/commonEffect/GalleryInput'; // 커스텀 입력 컴포넌트인 FloatingLabelInput을 임포트
import './CustomImageEditor.css'; // 사용자 정의 CSS 파일을 임포트
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'; // 드래그 앤 드롭을 위한 react-beautiful-dnd 컴포넌트를 임포트
import { useSelector } from 'react-redux';

// ImageEditor의 테마 설정
const myTheme = {
  'common.bi.image': '', // BI 이미지 제거
  'common.bisize.width': '0px', // BI 사이즈 설정
  'common.bisize.height': '0px',
  'common.backgroundImage': 'none', // 배경 이미지 제거
  'common.backgroundColor': '#fff', // 배경 색상 설정
  'common.border': '1px solid #c1c1c1', // 테두리 설정
};


const GalleryCreate = ({ onRegisterComplete, initialData = {}, isEditMode = false }) => {
  const editorRef = useRef(null); // ImageEditor 인스턴스를 참조하기 위한 ref
  const [title, setTitle] = useState(initialData.title || ''); // 제목 상태 관리
  const [content, setContent] = useState(initialData.content || ''); // 내용 상태 관리
  const [selectedImages, setSelectedImages] = useState(initialData.images ? initialData.images.map(url => ({ url, name: null })) : []); // 선택된 이미지 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(null); // 현재 편집 중인 이미지의 인덱스 관리
  const fileInputRef = useRef(null); // 파일 입력 필드에 대한 ref


  const userEmail = useSelector(state => state.user?.userData?.user.email || null);



  // 이미지 로드 함수 정의 (등록 및 수정 모두에서 사용)
  const loadImage = useCallback(async (index) => {
    const editorInstance = editorRef.current.getInstance(); // ImageEditor 인스턴스 가져오기
    const selectedImage = selectedImages[index]; // 선택된 이미지 가져오기
    if (selectedImage && selectedImage.url) { // 이미지가 존재하는 경우
      try {
        await editorInstance.loadImageFromURL(selectedImage.url, 'selectedImage'); // URL을 통해 이미지 로드
        editorInstance.clearUndoStack(); // Undo 스택 초기화
        editorInstance.ui.activeMenuEvent(); // UI 메뉴 활성화
      } catch (error) {
        console.error('Error loading image:', error); // 에러 발생 시 콘솔에 출력
      }
    }
  }, [selectedImages]);

  // currentImageIndex가 변경될 때마다 이미지 로드
  useEffect(() => {
    if (currentImageIndex !== null) {
      loadImage(currentImageIndex);
    }
  }, [currentImageIndex, loadImage]);

  // 이미지 업로드 핸들러 (등록 시 이미지 업로드를 처리)
  const handleImageUpload = (event) => {
    const files = event.target.files; // 업로드된 파일들 가져오기
    const imagesArray = Array.from(files).slice(0, 8).map((file) => ({
      url: URL.createObjectURL(file), // 각 파일에 대해 객체 URL 생성
      name: file.name, // 파일 이름 저장
    }));
    setSelectedImages((prev) => {
      const updatedImages = prev.slice(); // 이전 이미지를 복사
      imagesArray.forEach((img, idx) => {
        if (updatedImages[idx]) { // 이미 존재하는 슬롯에 이미지를 업데이트
          updatedImages[idx] = img;
        } else { // 새로운 이미지를 추가
          updatedImages.push(img);
        }
      });
      return updatedImages; // 업데이트된 이미지를 반환
    });
    setCurrentImageIndex(0); // 첫 번째 이미지를 선택
  };

  // 박스를 클릭하여 이미지를 로드하고 편집 상태로 만듦 (수정 시 사용)
  const handleBoxClick = async (index) => {
    const editorInstance = editorRef.current.getInstance(); // ImageEditor 인스턴스 가져오기
    if (currentImageIndex !== null && selectedImages[currentImageIndex]?.url) { // 현재 이미지가 존재하는 경우
      try {
        const dataURL = editorInstance.toDataURL(); // 현재 이미지를 Data URL로 변환
        setSelectedImages((prev) =>
          prev.map((img, idx) => (idx === currentImageIndex ? { ...img, url: dataURL } : img)) // 현재 이미지를 업데이트
        );
      } catch (error) {
        console.error('Error saving image:', error); // 에러 발생 시 콘솔에 출력
      }
    }
    setCurrentImageIndex(index); // 선택한 이미지의 인덱스를 설정
    const selectedImage = selectedImages[index]; // 선택한 이미지 가져오기
    if (selectedImage && selectedImage.url) { // 이미지가 존재하는 경우
      try {
        await editorInstance.loadImageFromURL(selectedImage.url, 'selectedImage'); // URL을 통해 이미지 로드
        editorInstance.clearUndoStack(); // Undo 스택 초기화
        editorInstance.ui.activeMenuEvent(); // UI 메뉴 활성화
      } catch (error) {
        console.error('Error loading image:', error); // 에러 발생 시 콘솔에 출력
      }
    }
  };

  // 모든 이미지를 저장하고 등록을 완료 (등록 및 수정 모두에서 사용)
  const handleSaveAll = async () => {
    const editorInstance = editorRef.current.getInstance(); // ImageEditor 인스턴스 가져오기
    if (currentImageIndex !== null && selectedImages[currentImageIndex]?.url) { // 현재 이미지가 존재하는 경우
      try {
        const dataURL = editorInstance.toDataURL(); // 현재 이미지를 Data URL로 변환
        setSelectedImages((prev) =>
          prev.map((img, idx) => (idx === currentImageIndex ? { ...img, url: dataURL } : img)) // 현재 이미지를 업데이트
        );
      } catch (error) {
        console.error('Error saving image:', error); // 에러 발생 시 콘솔에 출력
      }
    }

    const formData = new FormData(); // 폼 데이터 생성
    for (const image of selectedImages) {
      if (image.url && !image.url.startsWith('http')) { // 이미지가 로컬에 있는 경우
        const blob = await (await fetch(image.url)).blob(); // 이미지를 Blob으로 변환
        formData.append('files', blob, image.name || 'image.jpg'); // Blob을 FormData에 추가
      }
    }
    formData.append('writer',userEmail);
    formData.append('title', title); // 제목을 FormData에 추가
    formData.append('content', content); // 내용을 FormData에 추가
    formData.append('order', JSON.stringify(selectedImages.map((_, index) => index))); // 이미지 순서 추가

    onRegisterComplete(formData); // 등록 또는 수정 완료 핸들러 호출
  };

  // 이미지 로드 시 에러 처리
  const handleError = (error) => {
    console.error('Error loading image:', error); // 에러 발생 시 콘솔에 출력
    alert('Error loading image. Please try again with a valid image.'); // 사용자에게 에러 메시지 알림
  };

  // 파일 입력 버튼 클릭 시 파일 선택 창 열기
  const handleButtonClick = () => {
    fileInputRef.current.click(); // 파일 입력 필드 클릭
  };

  // 드래그 앤 드롭을 통해 이미지 순서 변경 (등록 및 수정 모두에서 사용)
  const onDragEnd = (result) => {
    if (!result.destination) return; // 목적지가 없는 경우 반환
    const items = Array.from(selectedImages); // 선택된 이미지를 배열로 변환
    const [reorderedItem] = items.splice(result.source.index, 1); // 드래그한 아이템을 제거
    items.splice(result.destination.index, 0, reorderedItem); // 드롭 위치에 아이템 삽입
    setSelectedImages(items); // 순서가 바뀐 이미지를 상태에 저장
    setCurrentImageIndex(result.destination.index); // 드롭된 아이템의 인덱스를 설정
  };

  // 빈 이미지 슬롯을 채우기 위해 사용 (등록 및 수정 모두에서 사용)
  const imageBoxes = [...selectedImages];
  while (imageBoxes.length < 8) { // 총 8개의 슬롯을 채우기 위해 빈 슬롯 추가
    imageBoxes.push({ url: null, name: null });
  }

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
        <Box sx={{ flex: '1 1 auto', width: '60%', height: '600px', marginRight: '10px' }}>
          <ImageEditor
            ref={editorRef} // ImageEditor 인스턴스 참조 설정
            includeUI={{
              theme: myTheme, // 커스텀 테마 적용
              menu: ['crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'], // 사용 가능한 메뉴 설정
              initMenu: '', // 초기 메뉴 설정
              uiSize: {
                width: '100%', // UI 너비 설정
                height: '600px', // UI 높이 설정
              },
              menuBarPosition: 'left', // 메뉴 바 위치 설정
            }}
            cssMaxHeight={500} // 최대 높이 설정
            cssMaxWidth={700} // 최대 너비 설정
            selectionStyle={{
              cornerSize: 20, // 선택 박스 모서리 크기 설정
              rotatingPointOffset: 70, // 회전 포인트 오프셋 설정
            }}
            usageStatistics={false} // 통계 사용 비활성화
            onError={handleError} // 에러 발생 시 처리 핸들러
          />
        </Box>

        <Box sx={{ flex: '0 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', height: '600px', gap: 2, marginTop: 5 }}>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload} // 이미지 업로드 핸들러 (등록 시 사용)
            ref={fileInputRef} // 파일 입력 필드 참조 설정
            style={{ display: 'none' }} // 입력 필드를 화면에 보이지 않게 설정
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleButtonClick} // 파일 입력 버튼 클릭 핸들러
            sx={{ top: -20, right: 0, margin: '0px' }}
          >
            Select Image
          </Button>
          <DragDropContext onDragEnd={onDragEnd}> {/* 드래그 앤 드롭 컨텍스트 설정 */}
          <Droppable droppableId="images" direction="horizontal">
  {(provided) => (
    <Grid
      container
      spacing={0.5}
      sx={{ width: '500px' }}
      {...provided.droppableProps}
      ref={provided.innerRef}
    >
      {imageBoxes.map((image, index) => (
        <Draggable key={index} draggableId={`image-${index}`} index={index}>
          {(provided, snapshot) => (
            <Grid
              item
              xs={3}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Box
                component="div"
                onClick={() => image.url && handleBoxClick(index)}
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: 100,
                  border: currentImageIndex === index ? '2px solid blue' : '1px solid gray',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: snapshot.isDragging ? '#e0e0e0' : '#f0f0f0',
                  marginBottom: 1,
                  visibility: snapshot.isDragging ? 'hidden' : 'visible',
                }}
              >
                {image.url && (
                  <Box
                    component="img"
                    src={image.url}
                    alt={`Selected ${index}`}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                )}
              </Box>
            </Grid>
          )}
        </Draggable>
      ))}
      {provided.placeholder}
    </Grid>
  )}
</Droppable>

          </DragDropContext>
          <FloatingLabelInput 
            label="Title" 
            sx={{ width: '500px', marginTop: '-10px' }} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} // 제목 입력 핸들러
          />
          <FloatingLabelInput 
            label="Content" 
            multiline 
            rows={7} 
            sx={{ width: '500px', marginTop: '0px' }} 
            value={content} 
            onChange={(e) => setContent(e.target.value)} // 내용 입력 핸들러
          />
          <Button variant="contained" color="primary" onClick={handleSaveAll} sx={{ marginTop: '0px' }}> {/* 모든 이미지를 저장하고 등록 완료 핸들러 호출 */}
            Save
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default GalleryCreate;

