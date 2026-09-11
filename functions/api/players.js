export async function onRequestGet(context) {
  try {
    const result = await context.env.DB
      .prepare(`
        SELECT
          id,
          name,
          mole,
          honey_drop,
          bowling
        FROM players
        ORDER BY id ASC
      `)
      .all();

    return Response.json(result.results);
  } catch (error) {
    return Response.json(
      {
        error: "データ取得に失敗しました",
        detail: String(error)
      },
      { status: 500 }
    );
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const name = String(body.name ?? "").trim();
    const mole = Number(body.mole ?? 0);
    const honeyDrop = Number(body.honey_drop ?? 0);
    const bowling = Number(body.bowling ?? 0);

    if (!name) {
      return Response.json(
        { error: "名前を入力してください" },
        { status: 400 }
      );
    }

    const result = await context.env.DB
      .prepare(`
        INSERT INTO players (
          name,
          mole,
          honey_drop,
          bowling
        )
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        name,
        mole,
        honeyDrop,
        bowling
      )
      .run();

    return Response.json({
      success: true,
      id: result.meta.last_row_id
    });

  } catch (error) {
    return Response.json(
      {
        error: "追加に失敗しました",
        detail: String(error)
      },
      { status: 500 }
    );
  }
}

export async function onRequestPut(context) {
  try {
    const body = await context.request.json();

    const id = Number(body.id);
    const name = String(body.name ?? "").trim();
    const mole = Number(body.mole ?? 0);
    const honeyDrop = Number(body.honey_drop ?? 0);
    const bowling = Number(body.bowling ?? 0);

    if (!id || !name) {
      return Response.json(
        { error: "idと名前が必要です" },
        { status: 400 }
      );
    }

    await context.env.DB
      .prepare(`
        UPDATE players
        SET
          name = ?,
          mole = ?,
          honey_drop = ?,
          bowling = ?
        WHERE id = ?
      `)
      .bind(
        name,
        mole,
        honeyDrop,
        bowling,
        id
      )
      .run();

    return Response.json({
      success: true
    });

  } catch (error) {
    return Response.json(
      {
        error: "更新に失敗しました",
        detail: String(error)
      },
      { status: 500 }
    );
  }
}

export async function onRequestDelete(context) {
  try {
    const url = new URL(context.request.url);

    const id = Number(
      url.searchParams.get("id")
    );

    if (!id) {
      return Response.json(
        { error: "idが必要です" },
        { status: 400 }
      );
    }

    await context.env.DB
      .prepare(`
        DELETE FROM players
        WHERE id = ?
      `)
      .bind(id)
      .run();

    return Response.json({
      success: true
    });

  } catch (error) {
    return Response.json(
      {
        error: "削除に失敗しました",
        detail: String(error)
      },
      { status: 500 }
    );
  }
}
