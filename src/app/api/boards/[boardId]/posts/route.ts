import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 첨부파일 타입 정의
interface Attachment {
  name: string;
  size: number;
  type: string;
  data: string;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  const { boardId } = await context.params;
  const numBoardId = Number(boardId);
  if (isNaN(numBoardId)) {
    return NextResponse.json(
      { message: 'boardId가 필요합니다' },
      { status: 400 }
    );
  }

  const posts = await prisma.post.findMany({
    where: {
      boardId: numBoardId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      profile: true,
      board: true,
      attachments: {
        select: {
          attachmentId: true,
          fileName: true,
          fileSize: true,
          fileType: true,
          createdAt: true,
          // fileData는 제외 (용량 때문에)
        },
      },
    },
  });

  // 필드명 매핑 (view -> views)
  const postsWithViews = posts.map((post) => ({
    ...post,
    views: post.view, // view 필드를 views로 매핑
  }));

  return NextResponse.json({ posts: postsWithViews });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ boardId: string }> }
) {
  try {
    const { boardId } = await context.params;
    const numBoardId = Number(boardId);

    if (isNaN(numBoardId)) {
      return NextResponse.json(
        { message: 'boardId가 유효하지 않습니다.' },
        { status: 400 }
      );
    }

    const requestData = await req.json();
    const { title, content, attachments, company, jobCategory, tags } =
      requestData;

    // 입력 데이터 검증
    if (!title || !content) {
      return NextResponse.json(
        { message: 'title, content는 필수 항목입니다.' },
        { status: 400 }
      );
    }

    const profile = await prisma.profile.findFirst(); // 테스트용 임시 사용자

    const board = await prisma.board.findUnique({
      where: { boardId: numBoardId },
    });
    console.log('📋 board 조회 결과:', board);

    if (!profile || !board) {
      console.log('❌ profile 또는 board가 존재하지 않음');
      return NextResponse.json(
        { message: 'profile 또는 board가 존재하지 않습니다.' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        boardId: numBoardId,
        profileId: profile.profileId,
        nickName: profile.nickName,
        // 메타정보 별도 저장
        company: company || null,
        jobCategory: jobCategory || null,
        tags: tags && tags.length > 0 ? tags.join(',') : null,
      },
    });

    console.log('✅ 게시글 생성 완료:', post.postId);

    // 첨부파일이 있는 경우 처리
    if (attachments && attachments.length > 0) {
      const attachmentFiles: Attachment[] = attachments;

      // 첨부파일을 데이터베이스에 저장
      for (const file of attachmentFiles) {
        // Base64 데이터를 Buffer로 변환 (data:image/png;base64, 접두사 제거)
        const base64Data = file.data.split(',')[1] || file.data;
        const fileBuffer = Buffer.from(base64Data, 'base64');

        // 데이터베이스에 첨부파일 저장
        const savedAttachment = await prisma.attachment.create({
          data: {
            postId: post.postId,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            fileData: fileBuffer,
          },
        });

        console.log(
          `  ✅ 저장 완료: attachmentId ${savedAttachment.attachmentId}`
        );
      }

      console.log('\n✅ 모든 첨부파일 데이터베이스 저장 완료!');
    } else {
      console.log('📎 첨부파일 없음');
    }

    const response = {
      message: '게시글이 성공적으로 생성되었습니다.',
      post,
      attachmentsCount: attachments?.length || 0,
      receivedData: {
        titleLength: title?.length || 0,
        contentLength: content?.length || 0,
        boardId: numBoardId,
        hasAttachments: !!(attachments && attachments.length > 0),
        attachmentNames:
          attachments?.map((file: Attachment) => file.name) || [],
      },
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('게시글 생성 중 오류:', error);
    return NextResponse.json(
      { message: '게시글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
