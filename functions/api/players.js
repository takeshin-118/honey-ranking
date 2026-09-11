function json(data, status = 200) {
  return new Response(
    JSON.stringify(data),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store"
      }
    }
  );
}


export async function onRequest(context) {

  const request = context.request;
  const method = request.method;

  try {

    /* =========================
       GET
       参加者一覧を取得
    ========================= */

    if (method === "GET") {

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


      return json(
        result.results
      );

    }


    /* =========================
       POST
       参加者を追加
    ========================= */

    if (method === "POST") {

      const body =
        await request.json();


      const name =
        String(
          body.name ?? ""
        ).trim();


      const mole =
        Number(
          body.mole ?? 0
        );


      const honeyDrop =
        Number(
          body.honey_drop ?? 0
        );


      const bowling =
        Number(
          body.bowling ?? 0
        );


      if (!name) {

        return json(
          {
            error:
              "名前を入力してください"
          },
          400
        );

      }


      if (
        !Number.isFinite(mole)
        ||
        !Number.isFinite(honeyDrop)
        ||
        !Number.isFinite(bowling)
      ) {

        return json(
          {
            error:
              "点数が正しくありません"
          },
          400
        );

      }


      const result =
        await context.env.DB
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


      return json(
        {
          success: true,
          id:
            result.meta.last_row_id
        },
        201
      );

    }


    /* =========================
       PUT
       参加者を更新
    ========================= */

    if (method === "PUT") {

      const body =
        await request.json();


      const id =
        Number(
          body.id
        );


      const name =
        String(
          body.name ?? ""
        ).trim();


      const mole =
        Number(
          body.mole ?? 0
        );


      const honeyDrop =
        Number(
          body.honey_drop ?? 0
        );


      const bowling =
        Number(
          body.bowling ?? 0
        );


      if (
        !id
        ||
        !name
      ) {

        return json(
          {
            error:
              "idと名前が必要です"
          },
          400
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


      return json(
        {
          success: true
        }
      );

    }


    /* =========================
       DELETE
       参加者を削除
    ========================= */

    if (method === "DELETE") {

      const url =
        new URL(
          request.url
        );


      const id =
        Number(
          url.searchParams.get(
            "id"
          )
        );


      if (!id) {

        return json(
          {
            error:
              "idが必要です"
          },
          400
        );

      }


      await context.env.DB
        .prepare(`
          DELETE FROM players
          WHERE id = ?
        `)
        .bind(id)
        .run();


      return json(
        {
          success: true
        }
      );

    }


    /* =========================
       OPTIONS
    ========================= */

    if (method === "OPTIONS") {

      return new Response(
        null,
        {
          status: 204
        }
      );

    }


    /* =========================
       その他
    ========================= */

    return json(
      {
        error:
          "このHTTPメソッドには対応していません",
        method
      },
      405
    );


  } catch (error) {

    console.error(error);


    return json(
      {
        error:
          "サーバー処理に失敗しました",
        detail:
          String(error)
      },
      500
    );

  }

}