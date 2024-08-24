// 파일 경로를 웹 URL로 변환하는 함수
function getFileUrl(filePath) {
    const baseUrl = 'http://localhost:4000/profile/';
    // 파일 경로에서 'profile/' 부분을 제거하여 상대 경로를 추출
    // 파일 경로의 첫 부분 'profile/'을 제거하여 상대 경로만 남도록 함
    const relativePath = filePath.replace(/^.*profile\\/, ''); 
    // 웹 URL을 반환, 윈도우 경로 구분자를 URL 경로 구분자로 변환
    return baseUrl + relativePath.replace(/\\/g, '/'); 
}

module.exports = { getFileUrl };