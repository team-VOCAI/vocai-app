import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ attachmentId: string }> }
) {
  try {
    const { attachmentId } = await context.params;
    const numAttachmentId = Number(attachmentId);

    if (isNaN(numAttachmentId)) {
      return NextResponse.json(
        { message: 'attachmentId가 유효하지 않습니다.' },
        { status: 400 }
      );
    }

    // 첨부파일 조회
    const attachment = await prisma.attachment.findUnique({
      where: { attachmentId: numAttachmentId },
    });

    if (!attachment) {
      return NextResponse.json(
        { message: '첨부파일을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 파일 데이터를 Buffer로 변환
    const fileBuffer = Buffer.from(attachment.fileData);

    // 파일 다운로드 응답
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': attachment.fileType,
        'Content-Length': attachment.fileSize.toString(),
        'Content-Disposition': `attachment; filename="${encodeURIComponent(
          attachment.fileName
        )}"`,
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    console.error('첨부파일 다운로드 중 오류:', error);
    return NextResponse.json(
      { message: '첨부파일 다운로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
