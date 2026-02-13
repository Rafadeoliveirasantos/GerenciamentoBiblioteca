using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[ApiController]
[Route("api/v1/[controller]")]
public class LivrosController : ControllerBase
{
    private readonly LivroService _service;

    public LivrosController(LivroService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var livros = await _service.GetAllAsync();
        return Ok(livros);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var livro = await _service.GetByIdAsync(id);

        if (livro == null)
            return NotFound(new { message = "Livro não encontrado" });

        return Ok(livro);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CriarLivroDto dto)
    {
        try
        {
            var livro = await _service.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = livro.Id }, livro);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] AtualizarLivroDto dto)
    {
        try
        {
            var livro = await _service.UpdateAsync(id, dto);

            if (livro == null)
                return NotFound(new { message = "Livro não encontrado" });

            return Ok(livro);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var deleted = await _service.DeleteAsync(id);

        if (!deleted)
            return NotFound(new { message = "Livro não encontrado" });

        return NoContent();
    }

    [HttpPost("{id}/capa")]
    public async Task<IActionResult> UploadCapa(Guid id, IFormFile arquivo)
    {
        try
        {
            var capaUrl = await _service.UploadCapaAsync(id, arquivo);
            return Ok(new { capaUrl });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Erro ao fazer upload da capa", error = ex.Message });
        }
    }

    [HttpDelete("{id}/capa")]
    public async Task<IActionResult> RemoverCapa(Guid id)
    {
        var removed = await _service.RemoverCapaAsync(id);

        if (!removed)
            return NotFound(new { message = "Livro não encontrado ou não possui capa" });

        return NoContent();
    }
}
